import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import IconWithTooltip from '~v5/shared/IconWithTooltip';

const meta: Meta<typeof IconWithTooltip> = {
  title: 'Shared/Icon With Tooltip',
  component: IconWithTooltip,
  decorators: [
    (StoryContent) => (
      <div className="max-w-[4rem]">
        <StoryContent />
      </div>
    ),
  ],
  argTypes: {
    tooltipContent: {
      name: 'tooltip content',
      control: {
        type: 'text',
      },
    },
    iconProps: {
      name: 'icon props',
      control: {
        type: 'object',
      },
    },
  },
  args: {
    children: 'User',
    tooltipContent: 'content',
    className: 'ml-2 text-warning-400',
    iconProps: {
      name: 'warning-circle',
    },
  },
};

export default meta;

export const Base: StoryObj<typeof IconWithTooltip> = {};
