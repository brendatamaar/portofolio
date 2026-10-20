// All visible content lives here and in src/content/blog. Swap in real material without touching markup.
//
// Assumptions (replace before publishing; each is also marked `placeholder: true` below):
// - Domain https://brendatama.dev and email hello@brendatama.dev are invented.
// - GitHub handle comes from the repository owner (brendatamaar); LinkedIn URL is a guess.
// - The four projects, their clients, years, stacks, request paths and budgets are fictional
//   examples that show how a case study reads. Clients are described, never named.
// - The bio, services, tool list, the six service cards, the four method steps and the FAQ
//   answers are a plausible starting point in your voice, not facts.
// - No location is stated because none was given.

export type Stage = { name: string; text: string };
export type Budget = { metric: string; target: string };

export type Project = {
  slug: string;
  title: string;
  client: string; // described, not named
  kind: string; // what it is, in two or three words
  year: number;
  span: [number, number]; // decimal years, start and end, drawn on the work timeline
  role: string[];
  stack: string[];
  summary: string; // one sentence: what changed, for whom
  context: string;
  idea: string;
  path: Stage[]; // the request path, in order: a real sequence
  budget: Budget[]; // targets it was built against, not results
  outcome: string;
  placeholder?: boolean;
};

export const site = {
  name: 'Brendatama Akbar',
  short: 'BA',
  role: 'Web software developer',
  url: 'https://brendatama.dev', // placeholder: production URL (canonical, OG, sitemap, RSS)
  description:
    'Brendatama Akbar is a web software developer who builds web applications that load fast and keep working on slow phones and bad connections.',
  intro: 'I build web applications that load fast and keep working on slow phones and bad connections.',
  email: 'hello@brendatama.dev', // placeholder
  availability: 'Taking on new work from January 2027. I reply within two working days.', // placeholder
  socials: [
    { label: 'GitHub', href: 'https://github.com/brendatamaar' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/brendatama-akbar/' }, // placeholder
    { label: 'RSS', href: '/rss.xml' },
  ],
  placeholder: true,
};

export const statement = {
  text: 'Most of what people call slow is decided before the first line of app code runs: what the server sends, in what order, and from how far away. I start there, then build the rest of the stack so it stays that way.',
  link: { label: 'how I read a waterfall', href: '/blog/reading-a-waterfall/' },
};

export const about = {
  bio: [
    'I’m Brendatama Akbar, a web software developer. I work across the whole request: the database schema, the API, the server that renders the page and the few kilobytes of script that make it interactive.',
    'Teams bring me in when a web app has become slow, fragile or hard to change, and when a new one needs to start out small and stay that way. I write about the parts I learn the hard way.',
  ],
  services: [
    'Web applications, front end to database',
    'Performance audits with fixes, not slide decks',
    'Accessibility repairs for existing products',
    'APIs, data models and migrations',
  ],
  tools: ['TypeScript', 'React', 'Astro', 'Node.js', 'PostgreSQL', 'Redis', 'Playwright', 'Docker'],
  placeholder: true,
};

// Card colors double as the waterfall legend: the network panel colors requests by type.
export type Tone = 'orange' | 'lavender' | 'coral' | 'green' | 'lime' | 'navy';

export const services: { title: string; text: string; tone: Tone; href: string; cta: string }[] = [
  { title: 'Web applications', text: 'From the database schema to the button: one person who can follow a bug through every layer.', tone: 'orange', href: '/work/night-shift/', cta: 'See Night Shift' },
  { title: 'Performance audits', text: 'I read the waterfall, find the slow requests and fix them in your code, not in a slide deck.', tone: 'lavender', href: '/blog/reading-a-waterfall/', cta: 'Read how I audit' },
  { title: 'Accessibility repairs', text: 'Keyboard paths, focus, contrast and screen reader names fixed in the product you already have.', tone: 'coral', href: `mailto:${site.email}`, cta: 'Email about an audit' },
  { title: 'APIs and data models', text: 'Schemas, migrations and tenant isolation that hold up when the second customer arrives.', tone: 'green', href: '/blog/row-level-security/', cta: 'Read about isolation' },
  { title: 'Offline first apps', text: 'Forms that save on the device first and sync when the signal comes back, without losing a record.', tone: 'lime', href: '/work/field-notes/', cta: 'See Field Notes' },
  { title: 'Interfaces that feel instant', text: 'Optimistic updates with honest pending states, so the screen never shows what the server refused.', tone: 'navy', href: '/blog/optimistic-updates-that-dont-lie/', cta: 'Read the pattern' },
];

export const method: { title: string; text: string; columns: { title: string; sub: string; chips: { label: string; tone: Tone }[] }[] }[] = [
  {
    title: 'Measure first',
    text: 'Before touching code I load your product on a throttled phone and read the waterfall, the traces and the error logs. The numbers decide what gets fixed first.',
    columns: [
      { title: 'Load', sub: 'What travels', chips: [{ label: 'Waterfall', tone: 'lime' }, { label: 'Bundle size', tone: 'orange' }, { label: 'Fonts', tone: 'coral' }] },
      { title: 'Run', sub: 'What blocks', chips: [{ label: 'Main thread', tone: 'navy' }, { label: 'Long tasks', tone: 'lavender' }, { label: 'Queries', tone: 'green' }] },
      { title: 'Use', sub: 'What breaks', chips: [{ label: 'Keyboard', tone: 'lavender' }, { label: 'Slow 4G', tone: 'lime' }, { label: 'Errors', tone: 'coral' }] },
    ],
  },
  { title: 'Fix the request path', text: 'Send less, send it earlier and send it from closer. Most speed lives in what the server returns before any app code runs.', columns: [] },
  { title: 'Build the feature', text: 'Server rendered HTML first, the least script that makes it interactive, and a data model that keeps tenants and records apart.', columns: [] },
  { title: 'Ship with a budget', text: 'Every project gets targets for load time, script size and errors, checked on each deploy so the speed stays after I leave.', columns: [] },
];

export const faq: { q: string; a: string }[] = [
  { q: 'What kind of projects do you take?', a: 'Web applications that need to be fast and dependable: new builds that should start small, and existing products that have become slow or fragile.' },
  { q: 'Can you work in an existing codebase?', a: 'Yes, most of my work is in code someone else started. I begin by measuring and reading, and change as little as the fix needs.' },
  { q: 'How do we start?', a: 'Send an email with a link and what is going wrong. I reply within two working days with questions or a short plan.' },
  { q: 'Do you stay on after launch?', a: 'I can. Budgets and checks run on every deploy, so you can also keep the speed without me.' },
];

export const projects: Project[] = [
  {
    slug: 'night-shift',
    title: 'Night Shift',
    client: 'A regional freight operator',
    kind: 'Live dispatch board',
    year: 2025,
    span: [2025.1, 2025.7],
    role: ['Lead developer', 'Front end', 'API'],
    stack: ['React', 'Node.js', 'PostgreSQL', 'WebSockets'],
    summary:
      'A live board that replaced a shared spreadsheet for the night dispatch team, so a truck’s status changes once and everyone sees it.',
    context:
      'Dispatchers tracked overnight trucks in a spreadsheet that three people edited at once. Rows were overwritten, calls went to the wrong driver, and the depot tablets took most of a minute to open the file over 4G.',
    idea:
      'Treat every status change as an event, not an edit. The board is a projection of an append-only log, so two dispatchers can never overwrite each other, and the tablets only download what changed since they last looked.',
    path: [
      { name: 'Tablet', text: 'Renders the board from a cached snapshot first, then applies live events over a WebSocket.' },
      { name: 'Edge', text: 'Serves the shell and the last snapshot from cache, so the board opens before the API answers.' },
      { name: 'API', text: 'Validates each event, writes it to the log and fans it out to every open board.' },
      { name: 'PostgreSQL', text: 'Stores the event log and a materialised view of current truck state for fast snapshots.' },
    ],
    budget: [
      { metric: 'Board usable on a depot tablet over 4G', target: '< 2 s' },
      { metric: 'Status change visible on every board', target: '< 1 s' },
      { metric: 'Script shipped for the board', target: '< 120 kB gz' },
    ],
    outcome:
      'The board shipped to the night team first and the day team asked for it a month later. The spreadsheet is now read only and kept as an archive.',
    placeholder: true,
  },
  {
    slug: 'small-print',
    title: 'Small Print',
    client: 'A five person legal practice',
    kind: 'Contract review workspace',
    year: 2024,
    span: [2024.05, 2024.75],
    role: ['Sole developer', 'Data model', 'Front end'],
    stack: ['Next.js', 'PostgreSQL', 'Row-level security', 'PDF.js'],
    summary:
      'A shared workspace where lawyers mark up contracts clause by clause, with every client’s documents walled off at the database.',
    context:
      'Contracts lived in email threads and comments lived in the margins of printed copies. The practice wanted one place to review them, and could not risk one client’s documents showing up in another client’s search.',
    idea:
      'Make isolation a property of the database instead of a habit of the code. Every query runs inside a transaction that names the client, and Postgres row-level security refuses anything outside it.',
    path: [
      { name: 'Browser', text: 'Streams the PDF page by page and keeps annotations in local state until the server confirms them.' },
      { name: 'Server', text: 'Renders the review page, opens a transaction and sets the current client for that request only.' },
      { name: 'Policies', text: 'Row-level security policies filter every table by client, including search.' },
      { name: 'Storage', text: 'Keeps original files in object storage behind short lived signed URLs.' },
    ],
    budget: [
      { metric: 'First page of a 60 page contract on screen', target: '< 1.5 s' },
      { metric: 'Queries that run without a client set', target: '0' },
      { metric: 'Annotation saved and confirmed', target: '< 300 ms' },
    ],
    outcome:
      'Reviews moved out of email. The isolation tests run on every deploy and fail the build if a query can read across clients.',
    placeholder: true,
  },
  {
    slug: 'open-kitchen',
    title: 'Open Kitchen',
    client: 'A group of three restaurants',
    kind: 'Ordering and kitchen display',
    year: 2023,
    span: [2023.15, 2023.6],
    role: ['Full stack developer'],
    stack: ['Astro', 'Preact', 'Node.js', 'Stripe Checkout'],
    summary:
      'Online ordering that loads on a bad phone signal, and a kitchen screen that shows each ticket the moment it is paid.',
    context:
      'Orders arrived through two delivery platforms and a phone line, and the kitchen read them off three different devices. The owners wanted their own ordering page without paying for an app.',
    idea:
      'Ship the menu as static HTML that works before any script loads, and add interactivity only to the basket. The kitchen display is the same order stream, sorted by the time each dish takes.',
    path: [
      { name: 'Phone', text: 'Loads a static menu page; the basket is the only interactive island.' },
      { name: 'CDN', text: 'Serves menus that rebuild when the kitchen marks a dish as sold out.' },
      { name: 'Checkout', text: 'Hands payment to a hosted checkout and waits for its webhook.' },
      { name: 'Kitchen', text: 'Receives paid orders over server-sent events, grouped by station.' },
    ],
    budget: [
      { metric: 'Menu readable on a slow 3G connection', target: '< 2.5 s' },
      { metric: 'Script on the menu page', target: '< 30 kB gz' },
      { metric: 'Paid order on the kitchen screen', target: '< 2 s' },
    ],
    outcome:
      'All three restaurants run their own ordering page. The kitchen screen replaced the tablets from the delivery platforms at the pass.',
    placeholder: true,
  },
  {
    slug: 'field-notes',
    title: 'Field Notes',
    client: 'An agronomy research team',
    kind: 'Offline survey app',
    year: 2022,
    span: [2022.2, 2022.85],
    role: ['Developer', 'Offline sync'],
    stack: ['Progressive web app', 'IndexedDB', 'Service worker', 'PostgreSQL'],
    summary:
      'A survey app that works all day without signal in the field and syncs when the phone finds a connection.',
    context:
      'Researchers recorded crop surveys on paper because their old app lost data whenever the signal dropped, which in the field was most of the time.',
    idea:
      'Assume there is no network. Every form saves to the device first, every record carries its own ID and edit history, and syncing is a merge of two logs rather than an upload.',
    path: [
      { name: 'Phone', text: 'Saves each record to IndexedDB with a client generated ID before anything else happens.' },
      { name: 'Service worker', text: 'Caches the whole app and queues changes while offline.' },
      { name: 'Sync API', text: 'Accepts batches of changes and resolves conflicts per field, keeping both values when they disagree.' },
      { name: 'PostgreSQL', text: 'Stores records and their change history for the research team’s exports.' },
    ],
    budget: [
      { metric: 'Records lost when the signal drops', target: '0' },
      { metric: 'App ready to use with no connection', target: '< 1 s' },
      { metric: 'A day of records synced on 3G', target: '< 30 s' },
    ],
    outcome:
      'The team stopped carrying paper forms. Conflicts that the merge cannot settle show up in a review queue instead of being silently overwritten.',
    placeholder: true,
  },
];

// Work timeline axis (decimal years).
export const timeline = { from: 2022, to: 2027 };
