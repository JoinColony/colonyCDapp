import { TransactionStatus } from '~gql';

import {
  type TransactionOrMessageGroup,
  type TransactionOrMessageGroups,
} from '../UserHub/partials/TransactionsTab/transactionGroup.ts';

export const getGroupStatus = (txGroup: TransactionOrMessageGroup) => {
  if (txGroup.some((tx) => tx.status === TransactionStatus.Failed))
    return TransactionStatus.Failed;

  if (txGroup.some((tx) => tx.status === TransactionStatus.Pending))
    return TransactionStatus.Pending;
  if (txGroup.every((tx) => tx.status === TransactionStatus.Succeeded))
    return TransactionStatus.Succeeded;
  return TransactionStatus.Ready;
};

export const findNewestGroup = (txGroups: TransactionOrMessageGroups) => {
  // @ts-ignore
  txGroups.sort((a, b) => new Date(b[0].createdAt) - new Date(a[0].createdAt));
  return txGroups[0];
};
