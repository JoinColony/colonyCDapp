import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import IconWithTooltip from '~v5/shared/IconWithTooltip';

const meta: Meta<typeof IconWithTooltip> = {
  title: 'Shared/IconWithTooltip',
  component: IconWithTooltip,
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
    className: 'ml-2 text-warning-400',
    iconProps: {
      name: 'warning-circle',
    },
  },
};

export default meta;
type Story = StoryObj<typeof IconWithTooltip>;

export const Base: Story = {
  render: (args) => (
    <div className="max-w-[4rem]">
      <IconWithTooltip {...args} tooltipContent="content">
        text
      </IconWithTooltip>
    </div>
  ),
};
