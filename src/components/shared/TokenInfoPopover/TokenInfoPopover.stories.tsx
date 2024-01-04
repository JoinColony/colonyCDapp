import React from 'react';

import { TokenType } from '~gql';

import TokenInfoPopover from './TokenInfoPopover';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof TokenInfoPopover> = {
  title: 'Shared/TokenInfoPopover',
  component: TokenInfoPopover,
  args: {
    token: {
      decimals: 18,
      name: 'Sample Token',
      symbol: 'TKN',
      type: TokenType.Erc20,
      avatar: 'https://cdn.britannica.com/92/100692-050-5B69B59B/Mallard.jpg',
      thumbnail:
        'https://cdn.britannica.com/92/100692-050-5B69B59B/Mallard.jpg',
      tokenAddress: '0x1234567890abcdef',
    },
    isTokenNative: true,
  },
};

export default meta;
type Story = StoryObj<typeof TokenInfoPopover>;

export const Base: Story = {
  render: (args) => (
    <TokenInfoPopover {...args}>
      <button type="button">Open me!</button>
    </TokenInfoPopover>
  ),
};
