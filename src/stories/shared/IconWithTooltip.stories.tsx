import { WarningCircle } from '@phosphor-icons/react';
import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

import IconWithTooltip from '~v5/shared/IconWithTooltip/index.ts';

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
    icon: {
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
    icon: WarningCircle,
  },
};

export default meta;

export const Base: StoryObj<typeof IconWithTooltip> = {};
