import {
  HandCoins,
  Money,

  // @TODO: uncomment when streaming payment is ready
  // Waves,
  ArrowsOutLineHorizontal,
  // @TODO: uncomment when staged payment is ready
  Steps,
  type Icon,
} from '@phosphor-icons/react';

import { Action } from '~constants/actions.ts';
import { formatText } from '~utils/intl.ts';

export type GroupListItem = {
  title: string;
  description: string;
  Icon: Icon;
  action: Action;
  isNew?: boolean;
  isHidden?: boolean;
};

export const GROUP_LIST: GroupListItem[] = [
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
    isNew: true,
  },
  // @TODO: uncomment when streaming payment is ready
  // {
  //   title: formatText({ id: 'actions.streamingPayment' }),
  //   description: formatText({
  //     id: 'actions.description.streamingPayment',
  //   }),
  //   Icon: Waves,
  //   action: Action.StreamingPayment,
  //   isNew: true,
  // },
  {
    title: formatText({ id: 'actions.splitPayment' }),
    description: formatText({ id: 'actions.description.splitPayment' }),
    Icon: ArrowsOutLineHorizontal,
    action: Action.SplitPayment,
    isNew: true,
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
