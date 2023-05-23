import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import UserHub from '~common/Extensions/UserHub';
import { getContext, ContextModule } from '~context';
import store from '~redux/createReduxStore';

const meta: Meta<typeof UserHub> = {
  title: 'Common/User Hub',
  component: UserHub,
};

export default meta;
type Story = StoryObj<typeof UserHub>;

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
