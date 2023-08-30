import { TransactionStatus } from '~gql';
import { TransactionsItemProps } from './types';

export const transactionsItems: TransactionsItemProps[] = [
  {
    key: 1,
    title: 'Transfer funds',
    description: 'Transfer 500xDAI from Root to Business',
    date: '21 Feb 2022',
    status: TransactionStatus.Failed,
    content: [
      {
        key: 'transaction-1-1',
        title: 'Submit work',
        notificationInfo: 'User cancelled the transaction via their wallet.',
        status: TransactionStatus.Failed,
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
    status: TransactionStatus.Succeeded,
    content: [
      {
        key: 'transaction-2-1',
        status: TransactionStatus.Succeeded,
        title: 'Submit work',
        isPending: true,
        isCurrentAction: true,
      },
      {
        key: 'transaction-2-2',
        status: TransactionStatus.Succeeded,
        title: 'End task',
      },
      {
        key: 'transaction-2-3',
        status: TransactionStatus.Succeeded,
        title: 'Rate Manager',
      },
      {
        key: 'transaction-2-4',
        status: TransactionStatus.Succeeded,
        title: 'Rate Worker',
      },
      {
        key: 'transaction-2-5',
        status: TransactionStatus.Succeeded,
        title: 'Reveal Rating',
      },
      {
        key: 'transaction-2-6',
        status: TransactionStatus.Succeeded,
        title: 'Finalize Task',
      },
      {
        key: 'transaction-2-7',
        status: TransactionStatus.Succeeded,
        title: 'Claim rewards',
      },
    ],
  },
  {
    key: 3,
    title: 'Edit Colony details',
    status: TransactionStatus.Succeeded,
    description: "Updated the Colony's logo with new design",
    date: '18 Feb 2022',
    content: [
      {
        key: 'transaction-3-1',
        status: TransactionStatus.Succeeded,
        title: 'Submit work',
        isCurrentAction: true,
      },
    ],
  },
  {
    key: 4,
    title: 'Create new team',
    status: TransactionStatus.Succeeded,
    description: 'Created Product Design team for new designers',
    date: '18 Feb 2022',
  },
  {
    key: 5,
    title: 'Simple payment',
    status: TransactionStatus.Succeeded,
    description: 'Paid Panda 100,000 CLNY',
    date: '18 Feb 2022',
  },
  {
    key: 6,
    title: 'Simple payment',
    status: TransactionStatus.Succeeded,
    description: 'Paid CaptainPlanet 67,000 CLNY',
    date: '18 Feb 2022',
  },
];
