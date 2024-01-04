import CopyWallet from '~v5/shared/CopyWallet';

import type { Meta, StoryObj } from '@storybook/react';

const copyWalletMeta: Meta<typeof CopyWallet> = {
  title: 'Shared/Copy wallet',
  component: CopyWallet,
  args: {
    disabled: false,
    value: '0xF4d61eFf5e2F47a430E189A09337Da5A68A4cb55',
    isCopied: false,
  },
};

export default copyWalletMeta;

export const Base: StoryObj<typeof CopyWallet> = {};

export const WithCopiedWallet: StoryObj<typeof CopyWallet> = {
  args: {
    isCopied: true,
  },
};

export const WithDisabledButton: StoryObj<typeof CopyWallet> = {
  args: {
    disabled: true,
  },
};
