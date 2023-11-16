import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { TokenType } from '~gql';

import TokenInfoPopover from './TokenInfoPopover';

const meta: Meta<typeof TokenInfoPopover> = {
  title: 'Shared/TokenInfoPopover',
  component: TokenInfoPopover,
  argTypes: {
    token: {
      description: 'Token data for your component',
      control: { type: 'object' },
      table: {
        defaultValue: {
          decimals: 18,
          name: 'Sample Token',
          symbol: 'TKN',
          type: TokenType.Erc20,
          avatar:
            'https://cdn.britannica.com/92/100692-050-5B69B59B/Mallard.jpg',
          thumbnail:
            'https://cdn.britannica.com/92/100692-050-5B69B59B/Mallard.jpg',
          tokenAddress: '0x1234567890abcdef',
        },
      },
    },
    isTokenNative: {
      description: 'Is it the native token?',
      defaultValue: false,
      control: { type: 'boolean' },
    },
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
