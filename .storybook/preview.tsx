import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import type { Preview } from '@storybook/react';

import '~utils/yup/customMethods';
import { reactIntl } from './reactIntl.js';
import { applyTheme } from '../src/components/frame/Extensions/themes/utils';

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
      <MemoryRouter>
        <Routes>
          <Route path="/*" element={<Story />} />
        </Routes>
      </MemoryRouter>
    );
  },
];

export default preview;
