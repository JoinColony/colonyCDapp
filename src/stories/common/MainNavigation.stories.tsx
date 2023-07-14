import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import MainNavigation from '~common/Extensions/MainNavigation';

const meta: Meta<typeof MainNavigation> = {
  title: 'Common/Main Navigation',
  component: MainNavigation,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof MainNavigation>;

export const Base: Story = {
  decorators: [
    (Story) => (
      <Router>
        <Story />
      </Router>
    ),
  ],
};
