import { withRouter } from 'storybook-addon-react-router-v6';

import '~utils/yup/customMethods';
import type { Preview } from '@storybook/react';
import '../src/styles/main.global.css';
import { reactIntl } from './reactIntl.js';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    options: {
      storySort: {
        order: ['Common', 'Frame', 'Shared'],
      },
    },
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

export const decorators = [withRouter];

export default preview;
