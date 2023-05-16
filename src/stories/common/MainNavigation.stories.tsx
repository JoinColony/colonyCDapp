import type { Meta, StoryObj } from '@storybook/react';
import MainNavigation from '~common/Extensions/MainNavigation/MainNavigation';

const meta: Meta<typeof MainNavigation> = {
  title: 'Common/Main Navigation',
  component: MainNavigation,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof MainNavigation>;

export const Base: Story = {};
