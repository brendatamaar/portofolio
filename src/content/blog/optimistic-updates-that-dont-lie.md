---
title: Optimistic updates that don’t lie
description: Showing a change before the server confirms it makes an app feel instant. Here is how I do it without showing people things that never happened.
date: 2026-06-30
tags: [frontend, ux, api]
placeholder: true
---

An optimistic update shows the result of an action before the server has confirmed it. You tick a checkbox and it is ticked, right away, while the request travels. Done well, the app feels instant. Done badly, it shows people a state that the server rejected, and they only find out when they reload.

I use three rules to keep the speed without the lie.

## 1. Pending is a state, not a moment

The update is not “done” the moment you paint it. Give it a visible pending state that is quiet but real: a lighter colour, a small spinner after a delay, an item that cannot be edited again yet. Most of the time it lasts 100 ms and nobody notices. When the network is slow, it is the difference between “saving” and “saved”.

In code that means the local state has three values, not two:

```ts
type Status = 'pending' | 'confirmed' | 'failed';
type Item = { id: string; title: string; done: boolean; status: Status };
```

## 2. Every action can be retried safely

If the request times out, you do not know whether the server applied it. Retrying a plain `POST` might create the thing twice. So every mutating request carries an idempotency key that the client generates once per action:

```ts
async function toggle(item: Item) {
  const key = crypto.randomUUID();
  setItem({ ...item, done: !item.done, status: 'pending' });
  try {
    const saved = await send('/api/items/' + item.id, { done: !item.done }, { key });
    setItem({ ...saved, status: 'confirmed' });
  } catch {
    setItem({ ...item, status: 'failed' });
  }
}
```

The server stores the key with the result. If it sees the same key again, it returns the stored result instead of applying the change a second time. Now the client can retry as often as it likes.

## 3. The server’s answer wins

When the response arrives, replace the optimistic version with what the server returned, not with what you guessed. The server may have trimmed a title, rounded a price or merged someone else’s edit. If you keep your guess, the screen and the database disagree until the next reload.

When the request fails, roll back to the previous value and say so near the thing that failed, with a way to try again. A toast in the corner is easy to miss; a red outline on the row you just edited is not.

## Where I don’t use it

Payments, deletions that cannot be undone, and anything where acting on a wrong state costs money. For those, a fast honest spinner is better than a fast optimistic one. The goal was never to hide the network. It was to stop making people wait for confirmations that almost always succeed.
