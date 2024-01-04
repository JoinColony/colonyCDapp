import CopyWalletAddressButton from '~v5/shared/CopyWalletAddressButton';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof CopyWalletAddressButton> = {
  title: 'Shared/Copy Wallet Address Button',
  component: CopyWalletAddressButton,
  argTypes: {
    walletAddress: {
      name: 'Wallet address',
      control: {
        type: 'text',
      },
    },
  },
  args: {
    walletAddress: '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
  },
};

export default meta;
type Story = StoryObj<typeof CopyWalletAddressButton>;

export const Base: Story = {};
