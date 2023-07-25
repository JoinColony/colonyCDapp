import type { Meta, StoryObj } from '@storybook/react';

import UserAvatarPopover from '~v5/shared/UserAvatarPopover';
import {
  colonyReputationItems,
  permissionsItems,
} from '~v5/shared/UserAvatarPopover/partials/consts';

const meta: Meta<typeof UserAvatarPopover> = {
  title: 'Shared/User Avatar Popover',
  component: UserAvatarPopover,
  argTypes: {
    userName: {
      name: 'User name',
      control: {
        type: 'text',
      },
    },
    walletAddress: {
      name: 'Wallet address',
      control: {
        type: 'text',
      },
    },
    aboutDescription: {
      name: 'About description',
      control: {
        type: 'text',
      },
    },
  },
  args: {
    userName: 'Panda',
    walletAddress: '0x155....1051',
    aboutDescription: `Passionate about sustainability and living a zero-waste lifestyle. Lover of all things vintage and retro. High-tops are my everything.`,
    colonyReputation: colonyReputationItems,
    permissions: permissionsItems,
  },
};

export default meta;
type Story = StoryObj<typeof UserAvatarPopover>;

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
    teams: ['businnes', 'product', 'design'],
  },
};
