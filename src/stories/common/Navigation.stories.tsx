import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import Navigation from '~common/Extensions/Navigation';
import { getContext, ContextModule } from '~context';
import store from '~redux/createReduxStore';

const apolloClient = getContext(ContextModule.ApolloClient);

const meta: Meta<typeof Navigation> = {
  title: 'Common/Navigation',
  component: Navigation,
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

export default meta;
type Story = StoryObj<typeof Navigation>;

export const Base: Story = {};
