import UserPopover from '~v5/shared/UserPopover/index.ts';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof UserPopover> = {
  title: 'Shared/User Avatar Popover',
  component: UserPopover,
  argTypes: {
    user: {
      name: 'User',
      control: {
        type: 'object',
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
    user: {
      profile: { displayName: 'Panda' },
      walletAddress: '0x0',
    },
    walletAddress: '0x155....1051',
  },
};

export default meta;
type Story = StoryObj<typeof UserPopover>;

export const Base: Story = {};

export const Verified: Story = {
  args: {
    userStatus: 'verified',
  },
};

export const New: Story = {
  args: {
    userStatus: 'new',
  },
};

export const Active: Story = {
  args: {
    userStatus: 'active',
  },
};

export const Dedicated: Story = {
  args: {
    userStatus: 'dedicated',
  },
};

export const Top: Story = {
  args: {
    userStatus: 'top',
  },
};
