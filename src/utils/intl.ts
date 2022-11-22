import { createIntl, createIntlCache } from '@formatjs/intl';

// https://formatjs.io/docs/intl

const cache = createIntlCache();

/* For use outside of React components */
/**
 *
 * @param messages A messages object of the form: { id: message }
 * @param locale Specify the locale. Defaults to 'en'.
 * @returns Intl object, with helpful utils such as `formatMessage`
 */
export const intl = (messages: Record<string, string> = {}, locale = 'en') =>
  createIntl(
    {
      messages,
      locale,
    },
    cache,
  );
