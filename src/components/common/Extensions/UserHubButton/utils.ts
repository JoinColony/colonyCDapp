import { TransactionStatus } from '~gql';

import {
  type TransactionOrMessageGroup,
  type TransactionOrMessageGroups,
} from '../UserHub/partials/TransactionsTab/transactionGroup.ts';

export const getGroupStatus = (
  txGroup: TransactionOrMessageGroup | undefined,
) => {
  if (txGroup?.some((tx) => tx.status === TransactionStatus.Failed))
    return TransactionStatus.Failed;

  if (txGroup?.some((tx) => tx.status === TransactionStatus.Pending))
    return TransactionStatus.Pending;

  if (txGroup?.every((tx) => tx.status === TransactionStatus.Succeeded))
    return TransactionStatus.Succeeded;

  if (txGroup?.some((tx) => tx.status === TransactionStatus.Ready))
    return TransactionStatus.Ready;

  return null;
};

export const findNewestGroup = (
  txGroups: TransactionOrMessageGroups,
): TransactionOrMessageGroup | undefined => {
  txGroups.sort(
    (a, b) =>
      new Date(b[0].createdAt || 0).getTime() -
      new Date(a[0].createdAt || 0).getTime(),
  );
  return txGroups[0];
};
