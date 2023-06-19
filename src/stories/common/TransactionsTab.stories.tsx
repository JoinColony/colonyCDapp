import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import TransactionsTab from '~common/Extensions/UserHub/partials/TransactionsTab/TransactionsTab';
import { transactionsItems } from '~common/Extensions/UserHub/partials/TransactionsTab/consts';
import { useAccordion } from '~shared/Extensions/Accordion/hooks';

const meta: Meta<typeof TransactionsTab> = {
  title: 'Common/User Hub/Transactions tab',
  component: TransactionsTab,
  argTypes: {
    // @ts-ignore
    items: {
      name: 'Items',
      control: {
        type: 'object',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TransactionsTab>;

const TransactionsTabHooks = () => {
  const { openIndex, onOpenIndexChange } = useAccordion();

  return (
    <TransactionsTab
      openIndex={openIndex}
      onOpenIndexChange={onOpenIndexChange}
      // @ts-ignore
      items={transactionsItems}
    />
  );
};

export const Base: Story = {
  render: () => <TransactionsTabHooks />,
};
