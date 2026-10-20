// Shared state for the current soft navigation: the adapter writes it, the curtain and the
// waterfall read it. Real numbers only: `ms` is the measured fetch time of the next page.
export const net = { to: '/', start: 0, ms: 0, navigated: false };
