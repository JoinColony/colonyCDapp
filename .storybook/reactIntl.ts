import messages_en from '../src/i18n/en.json';

const locales = ['en'];

const messages = locales.reduce(
  (acc) => ({
    ...acc,
    en: messages_en,
  }),
  {},
);

const formats = {}; // optional, if you have any formats

export const reactIntl = {
  defaultLocale: 'en',
  locales,
  messages,
  formats,
};
