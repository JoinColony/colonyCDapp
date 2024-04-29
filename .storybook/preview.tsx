import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import type { Preview } from '@storybook/react';

import { Provider as ReduxProvider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import reduxPromiseListener from '../src/redux/createPromiseListener';
import createRootReducer from '../src/redux/createRootReducer';

import AppContextStub from './preview/AppContextStub';
import ColonyContextStub from './preview/ColonyContextStub';

const store = createStore(
  createRootReducer(),
  applyMiddleware(reduxPromiseListener.middleware),
);

import '../src/styles/main.css';

import '../src/utils/yup/customMethods';
import { reactIntl } from './reactIntl';
import { applyTheme } from '../src/components/frame/Extensions/themes/utils';

const preview: Preview = {
  parameters: {
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
      <ReduxProvider store={store}>
        <AppContextStub>
          <ColonyContextStub>
            <MemoryRouter>
              <Routes>
                <Route path="/*" element={<Story />} />
              </Routes>
            </MemoryRouter>
          </ColonyContextStub>
        </AppContextStub>
      </ReduxProvider>
    );
  },
];

export default preview;
