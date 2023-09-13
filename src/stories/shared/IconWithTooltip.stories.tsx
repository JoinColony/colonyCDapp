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
    isIconVisible: {
      name: 'icon visability',
      control: {
        type: 'boolean',
      },
    },
    hasMaxWidthTooltipContent: {
      name: 'has max width tooltip content',
      control: {
        type: 'boolean',
      },
    },
  },
  args: {
    children: 'User',
    iconName: 'warning-circle',
    isIconVisible: true,
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

export const WithLargeContent: Story = {
  render: (args) => (
    <div className="max-w-[4rem]">
      <IconWithTooltip
        {...args}
        hasMaxWidthTooltipContent={false}
        tooltipContent="0xbC13FD8d3383e32D5f45F9cfE0b56fc83D3E31C5"
      >
        User
      </IconWithTooltip>
    </div>
  ),
};
