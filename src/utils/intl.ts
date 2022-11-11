import { createIntl, createIntlCache } from '@formatjs/intl';

// https://formatjs.io/docs/intl

const cache = createIntlCache();

// For use outside of React components
export const intl = createIntl(
  {
    locale: 'en',
    messages: {},
  },
  cache,
);
