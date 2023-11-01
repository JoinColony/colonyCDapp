import type { Meta, StoryObj } from '@storybook/react';
import ProgressBar from '~shared/ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Shared/Progress Bar 2',
  component: ProgressBar,
  args: {
    value: 50,
    max: 100,
    threshold: 10,
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Base: Story = {};
