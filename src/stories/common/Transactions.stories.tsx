import type { Meta, StoryObj } from '@storybook/react';
import Transactions from '~common/Extensions/UserHub/partials/Transactions';
import { transactionsItems } from '~common/Extensions/UserHub/partials/Transactions/consts';

const meta: Meta<typeof Transactions> = {
  title: 'Common/User Hub/Transactions',
  component: Transactions,
  argTypes: {
    items: {
      name: 'Items',
      control: {
        type: 'object',
      },
    },
  },
  args: {
    items: transactionsItems,
  },
};

export default meta;
type Story = StoryObj<typeof Transactions>;

export const Base: Story = {};
