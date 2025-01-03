export default {
  'atomic-text': async () => await import('./atomic-text/atomic-text.js'),
  'atomic-load-more-results': async () =>
    await import('./atomic-load-more-results/atomic-load-more-results.js'),
} as Record<string, () => Promise<unknown>>;

export type * from './index.js';
