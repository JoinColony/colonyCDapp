import React from 'react';

import ProgressBar from '~v5/shared/ProgressBar/index.ts';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ProgressBar> = {
  title: 'Shared/Progress bar',
  component: ProgressBar,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="max-w-[25rem]">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    progress: {
      name: 'Progress',
      control: {
        type: 'range',
      },
    },
    isTall: {
      name: 'Is tall?',
      control: {
        type: 'boolean',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Base: Story = {
  args: {
    progress: 0,
  },
};

export const WithData: Story = {
  args: {
    progress: 40,
  },
};
