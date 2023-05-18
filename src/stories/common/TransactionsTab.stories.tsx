import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Transactions from '~common/Extensions/UserHub/partials/TransactionsTab';
import TransactionsTab from '~common/Extensions/UserHub/partials/TransactionsTab/TransactionsTab';
import { transactionsItems } from '~common/Extensions/UserHub/partials/TransactionsTab/consts';
import { useAccordion } from '~shared/Extensions/Accordion/hooks';

const meta: Meta<typeof Transactions> = {
  title: 'Common/User Hub/Transactions tab',
  component: Transactions,
  argTypes: {
    items: {
      name: 'Items',
      control: {
        type: 'object',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Transactions>;

const TransactionsTabHooks = () => {
  const { openIndex, onOpenIndexChange } = useAccordion();

  return <TransactionsTab openIndex={openIndex} onOpenIndexChange={onOpenIndexChange} items={transactionsItems} />;
};

export const Base: Story = {
  render: () => <TransactionsTabHooks />,
};
