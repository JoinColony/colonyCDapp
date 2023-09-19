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
    iconName: {
      name: 'icon name',
      control: {
        type: 'text',
      },
    },
  },
  args: {
    children: 'User',
    iconName: 'warning-circle',
    className: 'ml-2 text-warning-400',
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
