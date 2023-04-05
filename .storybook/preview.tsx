import React from 'react';
import type { Preview } from '@storybook/react';
import { MockedProvider } from '@apollo/client/testing';

import '~utils/yup/customMethods';
import '../src/styles/main.global.css';
import { reactIntl } from './reactIntl.js';
import { applyTheme } from "../src/components/frame/Extensions/themes/utils";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    options: {
      storySort: {
        order: ['Common', 'Frame', 'Shared'],
      },
    },
    apolloClient: {
      MockedProvider,
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

export const decorators = [
  (Story) => {
    applyTheme('light');

    return (
      <Story />
    );
  },
];

export default preview;
