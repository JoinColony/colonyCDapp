import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import PageLoader from './PageLoader';

const meta: Meta<typeof PageLoader> = {
  title: 'Common/PageLoader',
  component: PageLoader,
  argTypes: {},
  args: {},
};

export default meta;
type Story = StoryObj<typeof PageLoader>;

export const Base: Story = {
  render: (args) => <PageLoader {...args} />,
};
