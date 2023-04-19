import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Tooltip from '~shared/Extensions/Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Shared/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    placement: {
      name: 'Placement',
      options: ['top', 'left', 'right', 'bottom', 'top-start', 'top-end', 'bottom-start', 'bottom-end'],
      control: {
        type: 'select',
      },
    },
  },
  args: {
    placement: 'right',
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Base: Story = {
  render: (args) => (
    <Tooltip {...args} tooltipContent={<span>Wallet address copied</span>}>
      Trigger tooltip
    </Tooltip>
  ),
};

export const WithLink: Story = {
  render: (args) => (
    <Tooltip
      {...args}
      interactive
      tooltipContent={
        <span>
          <a href="/">Copy address</a>
        </span>
      }
    >
      Trigger tooltip
    </Tooltip>
  ),
};

export const Success: Story = {
  render: (args) => (
    <Tooltip {...args} isSuccess tooltipContent={<span>Copied</span>}>
      Trigger tooltip
    </Tooltip>
  ),
};
