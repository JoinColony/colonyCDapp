import { TRANSACTION_STATUSES } from '~types';
import { TransactionsItemProps } from './types';

export const transactionsItems: TransactionsItemProps[] = [
  {
    key: 1,
    title: 'Transfer funds',
    description: 'Transfer 500xDAI from Root to Business',
    date: '21 Feb 2022',
    status: TRANSACTION_STATUSES.FAILED,
    content: [
      {
        key: 'transaction-1-1',
        title: 'Submit work',
        notificationInfo: 'User cancelled the transaction via their wallet.',
        status: TRANSACTION_STATUSES.FAILED,
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
    key: 2,
    title: 'Simple payment',
    description: 'Paid Panda 100,000 CLNY',
    date: '21 Feb 2022',
    status: TRANSACTION_STATUSES.SUCCEEDED,
    content: [
      {
        key: 'transaction-2-1',
        status: TRANSACTION_STATUSES.SUCCEEDED,
        title: 'Submit work',
        isPending: true,
        isCurrentAction: true,
      },
      {
        key: 'transaction-2-2',
        status: TRANSACTION_STATUSES.SUCCEEDED,
        title: 'End task',
      },
      {
        key: 'transaction-2-3',
        status: TRANSACTION_STATUSES.SUCCEEDED,
        title: 'Rate Manager',
      },
      {
        key: 'transaction-2-4',
        status: TRANSACTION_STATUSES.SUCCEEDED,
        title: 'Rate Worker',
      },
      {
        key: 'transaction-2-5',
        status: TRANSACTION_STATUSES.SUCCEEDED,
        title: 'Reveal Rating',
      },
      {
        key: 'transaction-2-6',
        status: TRANSACTION_STATUSES.SUCCEEDED,
        title: 'Finalize Task',
      },
      {
        key: 'transaction-2-7',
        status: TRANSACTION_STATUSES.SUCCEEDED,
        title: 'Claim rewards',
      },
    ],
  },
  {
    key: 3,
    title: 'Edit Colony details',
    status: TRANSACTION_STATUSES.SUCCEEDED,
    description: 'Updated the Colony’s logo with new design',
    date: '18 Feb 2022',
    content: [
      {
        key: 'transaction-3-1',
        status: TRANSACTION_STATUSES.SUCCEEDED,
        title: 'Submit work',
        isCurrentAction: true,
      },
    ],
  },
  {
    key: 4,
    title: 'Create new team',
    status: TRANSACTION_STATUSES.SUCCEEDED,
    description: 'Created Product Design team for new designers',
    date: '18 Feb 2022',
  },
  {
    key: 5,
    title: 'Simple payment',
    status: TRANSACTION_STATUSES.SUCCEEDED,
    description: 'Paid Panda 100,000 CLNY',
    date: '18 Feb 2022',
  },
  {
    key: 6,
    title: 'Simple payment',
    status: TRANSACTION_STATUSES.SUCCEEDED,
    description: 'Paid CaptainPlanet 67,000 CLNY',
    date: '18 Feb 2022',
  },
];
