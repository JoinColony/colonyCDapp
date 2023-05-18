import type { Meta, StoryObj } from '@storybook/react';

import SubNavigation from './SubNavigation';

const meta: Meta<typeof SubNavigation> = {
  title: 'Common/Sub Navigation',
  component: SubNavigation,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof SubNavigation>;

export const Base: Story = {
  args: {},
};
