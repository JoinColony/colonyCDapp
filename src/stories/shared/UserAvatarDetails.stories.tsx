import type { Meta, StoryObj } from '@storybook/react';

import UserAvatarDetails from '~v5/shared/UserAvatarDetails';

const meta: Meta<typeof UserAvatarDetails> = {
  title: 'Shared/User Avatar Details',
  component: UserAvatarDetails,
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
  },
  args: {
    userName: 'Panda',
    walletAddress: '0x155....1051',
    isVerified: true,
  },
};

export default meta;
type Story = StoryObj<typeof UserAvatarDetails>;

export const Base: Story = {};
