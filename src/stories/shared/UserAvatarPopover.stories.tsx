import type { Meta, StoryObj } from '@storybook/react';
import UserAvatarPopover from '~shared/Extensions/UserAvatarPopover';
import { colonyReputationItems, permissionsItems } from '~shared/Extensions/UserAvatarPopover/partials/consts';

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
    isVerified: {
      name: 'Is verified?',
      control: {
        type: 'boolean',
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
    isVerified: true,
    aboutDescription: `Passionate about sustainability and living a zero-waste lifestyle. Lover of all things vintage and retro. High-tops are my everything.`,
    colonyReputation: colonyReputationItems,
    permissions: permissionsItems,
  },
};

export default meta;
type Story = StoryObj<typeof UserAvatarPopover>;

export const Base: Story = {};
