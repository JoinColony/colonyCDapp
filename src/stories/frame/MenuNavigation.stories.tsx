import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import MenuNavigation from '~frame/Extensions/MenuNavigation';
import { getContext, ContextModule } from '~context';
import store from '~redux/createReduxStore';

const meta: Meta<typeof MenuNavigation> = {
  title: 'Frame/Menu navigation',
  component: MenuNavigation,
};

export default meta;
type Story = StoryObj<typeof MenuNavigation>;

const apolloClient = getContext(ContextModule.ApolloClient);

export const Base: Story = {
  decorators: [
    (Story) => (
      <Provider store={store}>
        <ApolloProvider client={apolloClient}>
          <Router>
            <Story />
          </Router>
        </ApolloProvider>
      </Provider>
    ),
  ],
};
