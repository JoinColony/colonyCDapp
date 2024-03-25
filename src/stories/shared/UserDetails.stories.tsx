import UserDetails from '~v5/shared/UserDetails/index.ts';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof UserDetails> = {
  title: 'Shared/User Details',
  component: UserDetails,
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
type Story = StoryObj<typeof UserDetails>;

export const Base: Story = {};
