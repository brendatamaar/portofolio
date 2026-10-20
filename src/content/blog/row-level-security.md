---
title: 'Postgres RLS: the last line, not the only one'
description: How I use Postgres row-level security to keep tenants apart in a multi-tenant app, and the three ways it quietly stops protecting you.
date: 2026-04-11
tags: [postgres, security, backend]
placeholder: true
---

In a multi-tenant app, the worst bug is not a crash. It is one customer seeing another customer’s data. Most codebases guard against it with a `WHERE tenant_id = ?` on every query, which works until someone writes the one query that forgets.

Postgres row-level security moves that rule into the database. If the application forgets, the database still refuses. I use it on every multi-tenant project now, but it has sharp edges that are easy to miss.

## The basic setup

Turn it on for the table and write a policy that compares each row with a setting for the current request:

```sql
alter table documents enable row level security;
alter table documents force row level security;

create policy tenant_isolation on documents
  using (tenant_id = current_setting('app.tenant_id')::uuid)
  with check (tenant_id = current_setting('app.tenant_id')::uuid);
```

`using` filters what you can read, update and delete. `with check` stops you from writing a row into someone else’s tenant. Then every request sets the tenant inside its transaction:

```sql
begin;
select set_config('app.tenant_id', $1, true);  -- true = local to this transaction
select * from documents where id = $2;
commit;
```

Now a query that forgets the `WHERE` clause returns only the current tenant’s rows instead of everyone’s.

## Edge one: owners and superusers skip it

By default, the role that owns a table bypasses its policies, and so does any superuser or role with `BYPASSRLS`. If your app connects as the same role that ran the migrations, row-level security does nothing at all. That is what the `force row level security` line above is for, and it is also why I give the application its own role that owns nothing.

## Edge two: connection pools keep settings

If you use `set` instead of `set_config(..., true)` or `set local`, the setting stays on the connection after your request ends. With a pool, the next request on that connection inherits the previous tenant. Always set it per transaction, and make the app fail loudly when the setting is missing. `current_setting('app.tenant_id')` raises an error when the setting does not exist, which is what you want. On a pooled connection that has used the setting before, it comes back as an empty string instead, and the cast to `uuid` fails just as loudly. Passing `true` as a second argument makes it return null instead, and a null comparison quietly matches nothing.

## Edge three: it costs what an index costs

The policy becomes part of every query plan. Without an index that starts with `tenant_id`, a large table scans far more than it should. I add `tenant_id` as the leading column of the indexes that matter, and check the plans with `explain analyze` while connected as the application role, because the plan is different when the policy applies.

## Still write the WHERE clause

I keep the explicit tenant filter in application code anyway. It makes queries readable, it helps the planner, and it means the policy is a safety net that never has to catch anything. Then I add one test that runs a query without a tenant set and expects it to fail. If that test ever passes, something changed that I need to know about.
