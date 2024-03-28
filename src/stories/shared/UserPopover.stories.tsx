import UserPopover from '~v5/shared/UserPopover/index.ts';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof UserPopover> = {
  title: 'Shared/User Avatar Popover',
  component: UserPopover,
  argTypes: {
    size: {
      name: 'Size',
      control: {
        type: 'number',
      },
    },
    walletAddress: {
      name: 'Wallet address',
      control: {
        type: 'text',
      },
    },
  },
  args: {
    walletAddress: '0x155....1051',
  },
};

export default meta;
type Story = StoryObj<typeof UserPopover>;

export const Base: Story = {};
