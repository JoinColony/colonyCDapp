import {
  Waves,
  HandCoins,
  Money,
  ArrowsOutLineHorizontal,
  Steps,
} from '@phosphor-icons/react';
import React from 'react';

import { Action } from '~constants/actions.ts';

import ActionGroupingList from '../ActionGroupingList/index.ts';
import ActionGroupingWrapper from '../ActionGroupingWrapper/index.ts';

// @TODO: move texts to translations
const PaymentGroup = () => {
  return (
    <ActionGroupingWrapper
      title="Payments"
      description="From simple transactions to complex financial operations, we've got
        you covered. Quickly and easily pay members, contributors and supplies."
    >
      <ActionGroupingList
        color="blue"
        items={[
          {
            title: 'Simple payment',
            description: 'Quick, one-click transfers',
            Icon: Money,
            action: Action.SimplePayment,
          },
          {
            title: 'Advance payment',
            description: 'Multiple recipients, tokens, and schedules',
            Icon: HandCoins,
            action: Action.PaymentBuilder,
          },
          {
            title: 'Streaming payment',
            description: 'Pay recipients continuously at an agreed rate',
            Icon: Waves,
            action: Action.StreamingPayment,
          },
          {
            title: 'Split payment',
            description: 'Effortlessly divide funds among members',
            Icon: ArrowsOutLineHorizontal,
            action: Action.SplitPayment,
          },
          {
            title: 'Staged Payments',
            description: 'Multi-phase projects with upfront allocation',
            Icon: Steps,
            action: Action.StagedPayment,
            isNew: true,
          },
        ]}
      />
    </ActionGroupingWrapper>
  );
};
export default PaymentGroup;
