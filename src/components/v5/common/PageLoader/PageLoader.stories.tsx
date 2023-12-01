import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import PageLoader from './PageLoader';

const meta: Meta<typeof PageLoader> = {
  title: 'Common/PageLoader',
  component: PageLoader,
  argTypes: {
    loadingText: {
      name: 'loadingText',
      control: 'text',
    },
    loadingDescription: {
      name: 'loadingText',
      control: 'text',
    },
  },
  args: {
    loadingText: 'Loading app...',
    loadingDescription:
      "It's taking a while to connect.\nPlease hold tight while we keep trying.",
  },
};

export default meta;
type Story = StoryObj<typeof PageLoader>;

export const Base: Story = {
  render: (args) => <PageLoader {...args} />,
};
