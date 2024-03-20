import { CrownSimple } from '@phosphor-icons/react';
import React from 'react';

import Tooltip from '~shared/Extensions/Tooltip/index.ts';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Tooltip> = {
  title: 'Shared/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    placement: {
      name: 'Placement',
      options: [
        'auto',
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'right',
        'left',
      ],
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

export const Top: Story = {
  render: (args) => (
    <Tooltip
      {...args}
      tooltipContent={
        <>
          <span className="mb-2.5 flex items-center rounded-3xl border border-base-white px-3 py-1">
            <span className="flex shrink-0 items-center">
              <CrownSimple size={12} />
              <span className="ml-1 text-xs">Top </span>
            </span>
          </span>
          This user is in the top 20% of contributors within this Colony.
        </>
      }
    >
      Trigger tooltip
    </Tooltip>
  ),
};
