import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';
import StakesTab from '~common/Extensions/UserHub/partials/StakesTab/StakesTab';

const meta: Meta<typeof StakesTab> = {
  title: 'Common/User Hub/Stakes tab',
  component: StakesTab,
};

export default meta;
type Story = StoryObj<typeof StakesTab>;

export const Base: Story = {
  decorators: [
    (Story) => (
      <Router>
        <Story />
      </Router>
    ),
  ],
};
