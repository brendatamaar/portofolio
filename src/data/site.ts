// All visible content lives here and in src/content/blog.
//
// Source: the live portfolio at https://www.brendatama.dev/ (repo brendatamaar/portfolio,
// server/scripts/seed-resume.ts and web/src/pages/index.astro), copied as written.
// `detail` on each project is an English translation of the longer Indonesian description in
// that same file; the English `summary` is the original.
//
// Still placeholder: the four blog posts in src/content/blog (the real posts live in the live
// site's database, which is not in the repository).

export type Tone = 'orange' | 'lavender' | 'coral' | 'green' | 'lime' | 'navy';

export type Project = {
  slug: string;
  title: string;
  type: 'work' | 'side_project';
  company?: string;
  stack: string[];
  summary: string; // original English copy
  detail: string; // translated from the Indonesian copy, which is longer
  link?: { label: string; href: string };
  img?: { src: string; width: number; height: number };
  featured?: boolean;
};

export const site = {
  name: 'Brendatama Akbar',
  fullName: 'Brendatama Akbar Ramadan',
  firstName: 'Brendatama',
  short: 'BA',
  role: 'Web Software Developer',
  location: 'Jakarta, Indonesia',
  city: 'Jakarta',
  url: 'https://www.brendatama.dev',
  description:
    'I am a web software developer specializing in designing and building applications with a focus on simplicity and usability.',
  summary:
    'I am a web software developer specializing in designing and building applications with a focus on simplicity and usability. Currently, I work at PLN Icon Plus as a Web Software Developer. Have a keen interest in tech, RPG games, and good stories.',
  about:
    'Specializing in crafting seamless, high-performance web experiences emphasizing simplicity and usability.',
  email: 'brendatamaa@gmail.com',
  resume: '/pdf/brendatama-akbar-resume-2026.pdf',
  socials: [
    { label: 'GitHub', href: 'https://github.com/brendatamaar' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/brendatamaar/' },
    { label: 'RSS', href: '/rss.xml' },
  ],
  connect: {
    lead: 'Have an idea?',
    text: 'I’m always open to interesting conversations, collaborations, and opportunities.',
  },
};

export const work = [
  {
    company: 'Icon Plus',
    href: 'https://plniconplus.co.id/',
    title: 'Web Software Developer',
    start: '2022',
    end: 'Now',
    description: 'Working on several web products by delivering new major features.',
  },
  {
    company: 'Cipta Kreasi',
    title: 'Front-End Developer',
    start: '2020',
    end: '2022',
    description: 'Designed and developed SEO-optimized landing pages.',
  },
  {
    company: 'Tebuireng Telecom',
    title: 'Junior Front-End Developer',
    start: '2019',
    end: '2020',
    description: 'Assisted in developing web components and API-integration.',
  },
];

export const education = {
  school: 'CEP CCIT University of Indonesia',
  degree: 'Associate Degree in Information Engineering, GPA: 3.7',
  start: '2017',
  end: '2019',
  description:
    'Prominent coursework: Web & Mobile App Development, Databases, Object-oriented Programming, DevOps. Developed 24 applications for monthly project using various programming languages, frameworks and APIs.',
};

export const skills = ['TypeScript', 'React', 'NextJS', 'Vue', 'Tailwind', 'NodeJS', 'Spring Boot', 'Quarkus', 'Laravel'];

const img = (src: string, height: number) => ({ src: `/images/work/${src}`, width: 1200, height });

export const projects: Project[] = [
  // Side projects
  {
    slug: 'skenatify',
    title: 'skenatify',
    type: 'side_project',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Spotify API'],
    summary: 'Music discovery app that recommends tracks based on your favorite artists using Spotify audio feature filters.',
    detail: 'A music discovery app that recommends songs based on your favorite artists, using Spotify’s audio feature filters.',
    link: { label: 'View on GitHub', href: 'https://github.com/brendatamaar/skenatify' },
    img: img('skenatify.webp', 570),
    featured: true,
  },
  {
    slug: 'poker-hand-calculator',
    title: 'poker-hand-calculator',
    type: 'side_project',
    stack: ['JavaScript', 'Vite'],
    summary: 'Hand winning probability calculator in poker using Monte Carlo simulation.',
    detail: 'A calculator for the probability that a poker hand wins, using Monte Carlo simulation.',
    link: { label: 'View on GitHub', href: 'https://github.com/brendatamaar/poker-hand-calculator' },
    featured: true,
  },
  {
    slug: 'jpeg-encoder',
    title: 'jpeg-encoder',
    type: 'side_project',
    stack: ['JavaScript', 'Vite'],
    summary: 'Complete JPEG encoding pipeline implementing all 6 standard stages including entropy, bitrate, and compression ratio.',
    detail: 'A complete baseline JPEG encoding pipeline that implements all 6 standard stages, and visualises the compression metrics of each stage, including entropy, bitrate and compression ratio.',
    link: { label: 'Open the live demo', href: 'https://jpeg-encoder.vercel.app/' },
    img: img('jpeg-encoder.webp', 675),
    featured: true,
  },
  {
    slug: 'md-editor',
    title: 'MD Editor',
    type: 'side_project',
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'KaTeX', 'Mermaid'],
    summary: 'Markdown editor with split-view live preview, LaTeX math rendering, and Mermaid diagram support.',
    detail: 'An offline markdown editor with a split-view live preview, LaTeX math rendering, Mermaid diagram support and synchronised scrolling.',
    link: { label: 'View on GitHub', href: 'https://github.com/brendatamaar/md-editor' },
    featured: true,
  },
  {
    slug: 'admin-barcode',
    title: 'Admin Barcode',
    type: 'side_project',
    stack: ['Laravel', 'PostgreSQL', 'Docker'],
    summary: 'Inventory asset management system for generating and tracking QR codes.',
    detail: 'An inventory asset management system for creating and tracking barcodes and QR codes, with bulk Excel import and streamed PDF output. Access is controlled through RBAC.',
    link: { label: 'View on GitHub', href: 'https://github.com/brendatamaar/admin-barcode' },
  },
  // Work at Icon Plus
  {
    slug: 'air-tax',
    title: 'AIR Tax',
    type: 'work',
    company: 'Icon Plus',
    stack: ['Vue 3', 'Spring Boot', 'Kafka', 'JobRunr', 'Docker'],
    summary: 'Enterprise tax saas integrated with DJP. Covers tax invoicing, non-tax revenue reporting, and taxpayer status confirmation.',
    detail: 'A multi-module enterprise tax SaaS integrated with the DJP (Directorate General of Taxes) systems. It covers tax invoices, non-tax state revenue reporting and taxpayer status confirmation.',
    link: { label: 'Visit AIR Tax', href: 'https://web-blue.air.id/airtax-new' },
    img: img('airtax.webp', 624),
  },
  {
    slug: 'ap2t',
    title: 'AP2T',
    type: 'work',
    company: 'Icon Plus',
    stack: ['Vue 3', 'TypeScript', 'Tailwind CSS', 'Vite Module Federation'],
    summary: 'Platform designed to handle all business processes: revenue management, ERP, reporting, and CRM.',
    detail: 'An enterprise platform that handles every business process in one place: revenue management, ERP, reporting and CRM, built on more than 40 operational workflows through a micro-frontend architecture.',
  },
  {
    slug: 'dashboard-revenue',
    title: 'Dashboard Revenue',
    type: 'work',
    company: 'Icon Plus',
    stack: ['React', 'TypeScript', 'Go', 'GraphQL', 'PostgreSQL'],
    summary: 'Real-time analytics dashboard tracking OTC and recurring revenue streams.',
    detail: 'A real-time analytics dashboard that tracks one-time (OTC) and recurring revenue streams, running queries concurrently to aggregate in parallel.',
  },
  {
    slug: 'emi-crm',
    title: 'EMI CRM',
    type: 'work',
    company: 'Icon Plus',
    stack: ['Vue 3', 'TypeScript', 'Spring Boot', 'PostgreSQL'],
    summary: 'CRM managing sales, procurement, stock, and automated accounting integration.',
    detail: 'A CRM that manages sales, procurement, stock and automated accounting, with an event-driven integration that triggers real-time accounting postings across 8 transaction types.',
  },
  {
    slug: 'cheskp',
    title: 'cheSKP',
    type: 'work',
    company: 'Icon Plus',
    stack: ['Vue 3', 'TypeScript', 'Spring Boot', 'PostgreSQL'],
    summary: 'Customer satisfaction survey platform.',
    detail: 'A customer satisfaction survey platform with SSO authentication, multi-level role-based access and survey analytics.',
    link: { label: 'Visit cheSKP', href: 'https://cheskp-mobile.pln.co.id/' },
    img: img('cheskp.webp', 638),
  },
  {
    slug: 'esds',
    title: 'ESDS',
    type: 'work',
    company: 'Icon Plus',
    stack: ['Vue 3', 'Chart.js', 'Leaflet', 'Socket.IO', 'Docker'],
    summary: 'Electric stove conversion platform.',
    detail: 'An electric stove conversion platform that manages field surveys, installation, activation and bill verification, with real-time updates and geospatial map views.',
    link: { label: 'Visit ESDS', href: 'https://isds.pln.co.id' },
    img: img('esds.webp', 613),
  },
];

export const sideProjects = projects.filter((p) => p.type === 'side_project');
export const workProjects = projects.filter((p) => p.type === 'work');

// Card colors double as the waterfall legend: the network panel colors requests by type.
export const tones: Tone[] = ['orange', 'lavender', 'coral', 'green', 'lime', 'navy'];
