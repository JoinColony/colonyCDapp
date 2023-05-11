import type { Meta, StoryObj } from '@storybook/react';

import SubNavigation from './SubNavigation';

const meta: Meta<typeof SubNavigation> = {
  title: 'Common/SubNavigation',
  component: SubNavigation,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof SubNavigation>;

export const Base: Story = {};
