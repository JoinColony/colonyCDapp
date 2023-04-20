import type { Meta, StoryObj } from '@storybook/react';
import SubNavigation from './SubNavigation';

const meta: Meta<typeof SubNavigation> = {
  title: 'Common/SubNavigation',
  component: SubNavigation,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof SubNavigation>;

export const Base: Story = {
  args: {},
};
