import { TransactionsItemProps } from './types';

export const transactionsItems: TransactionsItemProps[] = [
  {
    key: 'transaction-1',
    title: 'Transfer funds',
    description: 'Transfer 500xDAI from Root to Business',
    date: '21 Feb 2022',
    content: [
      {
        key: 'transaction-1-1',
        title: 'Submit work',
        notificationInfo: 'User cancelled the transaction via their wallet.',
        status: 'failed',
        isCurrentAction: true,
      },
      {
        key: 'transaction-1-2',
        title: 'End task',
      },
      {
        key: 'transaction-1-3',
        title: 'Rate Manager',
      },
      {
        key: 'transaction-1-4',
        title: 'Rate Worker',
      },
      {
        key: 'transaction-1-5',
        title: 'Reveal Rating',
      },
      {
        key: 'transaction-1-6',
        title: 'Finalize Task',
      },
      {
        key: 'transaction-1-7',
        title: 'Claim rewards',
      },
    ],
  },
  {
    key: 'transaction-2',
    title: 'Simple payment',
    description: 'Paid Panda 100,000 CLNY',
    date: '21 Feb 2022',
    content: [
      {
        key: 'transaction-2-1',
        title: 'Submit work',
        isPending: true,
        isCurrentAction: true,
      },
      {
        key: 'transaction-2-2',
        title: 'End task',
      },
      {
        key: 'transaction-2-3',
        title: 'Rate Manager',
      },
      {
        key: 'transaction-2-4',
        title: 'Rate Worker',
      },
      {
        key: 'transaction-2-5',
        title: 'Reveal Rating',
      },
      {
        key: 'transaction-2-6',
        title: 'Finalize Task',
      },
      {
        key: 'transaction-2-7',
        title: 'Claim rewards',
      },
    ],
  },
  {
    key: 'transaction-3',
    title: 'Edit Colony details',
    description: 'Updated the Colony’s logo with new design',
    date: '18 Feb 2022',
  },
  {
    key: 'transaction-4',
    title: 'Create new team',
    description: 'Created Product Design team for new designers',
    date: '18 Feb 2022',
  },
  {
    key: 'transaction-5',
    title: 'Simple payment',
    description: 'Paid Panda 100,000 CLNY',
    date: '18 Feb 2022',
  },
  {
    key: 'transaction-6',
    title: 'Simple payment',
    description: 'Paid CaptainPlanet 67,000 CLNY',
    date: '18 Feb 2022',
  },
];
