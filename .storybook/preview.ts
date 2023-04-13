import type { Preview } from '@storybook/react';
import './main.css';
import { reactIntl } from './reactIntl.js';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    reactIntl,
    locale: reactIntl.defaultLocale,
    locales: {
      en: 'English',
    },
  },
};

export default preview;
