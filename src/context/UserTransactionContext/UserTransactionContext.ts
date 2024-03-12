import { createContext, useContext } from 'react';

import { type useGroupedTransactionsAndMessages } from '~common/Extensions/UserNavigation/hooks.ts';

export enum TransactionGroupStates {
  Loading = 'Loading',
  NonePending = 'NonePending',
  SomePending = 'SomePending',
  SomeFailed = 'SomeFailed',
  AllCompleted = 'AllCompleted',
}

export interface UserTransactionContextValues
  extends Omit<
    ReturnType<typeof useGroupedTransactionsAndMessages>,
    'refetchTransactions'
  > {
  groupState: TransactionGroupStates;
}

export const UserTransactionContext =
  createContext<UserTransactionContextValues | null>(null);

export const useUserTransactionContext = () => {
  const context = useContext(UserTransactionContext);
  if (!context) {
    throw new Error(
      'useUserTransactionContext must be used within a UserTransactionContextProvider',
    );
  }
  return context;
};
