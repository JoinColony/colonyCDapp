import {
  Waves,
  HandCoins,
  Money,
  ArrowsOutLineHorizontal,
  Steps,
} from '@phosphor-icons/react';

import { Action } from '~constants/actions.ts';
import { formatText } from '~utils/intl.ts';

export const GROUPING_LIST = [
  {
    title: formatText({ id: 'actions.simplePayment' }),
    description: formatText({
      id: 'actions.description.simplePayment',
    }),
    Icon: Money,
    action: Action.SimplePayment,
  },
  {
    title: formatText({ id: 'actions.paymentBuilder' }),
    description: formatText({
      id: 'actions.description.paymentBuilder',
    }),
    Icon: HandCoins,
    action: Action.PaymentBuilder,
  },
  {
    title: formatText({ id: 'actions.streamingPayment' }),
    description: formatText({
      id: 'actions.description.streamingPayment',
    }),
    Icon: Waves,
    action: Action.StreamingPayment,
  },
  {
    title: formatText({ id: 'actions.splitPayment' }),
    description: formatText({ id: 'actions.description.splitPayment' }),
    Icon: ArrowsOutLineHorizontal,
    action: Action.SplitPayment,
  },
  {
    title: formatText({ id: 'actions.stagedPayment' }),
    description: formatText({
      id: 'actions.description.stagedPayment',
    }),
    Icon: Steps,
    action: Action.StagedPayment,
    isNew: true,
  },
];
