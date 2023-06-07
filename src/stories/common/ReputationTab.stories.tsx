import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import ReputationTab from '~common/Extensions/UserHub/partials/ReputationTab';
import { getContext, ContextModule } from '~context';

const meta: Meta<typeof ReputationTab> = {
  title: 'Common/User Hub/Reputation tab',
  component: ReputationTab,
};

export default meta;
type Story = StoryObj<typeof ReputationTab>;

const apolloClient = getContext(ContextModule.ApolloClient);

export const Base: Story = {
  decorators: [
    (Story) => (
      <ApolloProvider client={apolloClient}>
        <Router>
          <Story />
        </Router>
      </ApolloProvider>
    ),
  ],
};
