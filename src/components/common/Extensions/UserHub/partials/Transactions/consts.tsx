import { TransactionsItem } from './types';

export const transactionsItems: TransactionsItem[] = [
  {
    key: '1',
    title: 'Transfer funds',
    description: 'Transfer 500xDAI from Root to Business',
    date: '21 Feb 2022',
    state: 'passed',
    content: [
      {
        key: '1',
        title: 'Submit work',
        info: 'User cancelled the transaction via their wallet.',
        state: 'failed',
      },
      {
        key: '2',
        title: 'End task',
      },
    ],
  },
  {
    key: '2',
    title: 'Simple payment',
    description: 'Paid Panda 100,000 CLNY',
    date: '21 Feb 2022',
    state: 'failed',
    content: [
      {
        key: '1',
        title: 'Submit work',
        info: 'User cancelled the transaction via their wallet.',
        state: 'failed',
        isCurrentAction: true,
      },
      {
        key: '2',
        title: 'End task',
      },
    ],
  },
];
