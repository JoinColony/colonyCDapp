import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useGroupedTransactionsAndMessages } from '~common/Extensions/UserNavigation/hooks';
import { useMounted } from '~hooks';
import { SetStateFn, TransactionStatus } from '~types';

interface UserTransactionContextValues
  extends ReturnType<typeof useGroupedTransactionsAndMessages> {
  isLatestTxPending: boolean;
  showCompletedButton: boolean;
  isUserHubOpen: boolean;
  setIsUserHubOpen: SetStateFn<boolean>;
}

export const UserTransactionContext =
  createContext<UserTransactionContextValues | null>(null);

export const UserTransactionContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [isUserHubOpen, setIsUserHubOpen] = useState(false);

  const {
    transactionAndMessageGroups,
    fetchMoreTransactions,
    canLoadMoreTransactions,
  } = useGroupedTransactionsAndMessages();

  const isLatestTxPending = (transactionAndMessageGroups[0] ?? []).some(
    (group) => group.status === TransactionStatus.Pending,
  );

  const [showCompletedButton, setShowCompletedButton] = useState(false);
  const [previousPending, setPreviousPending] = useState(false);

  if (isLatestTxPending && !previousPending) {
    setPreviousPending(true);
  }

  const { current: isMounted } = useMounted();

  if (!isLatestTxPending && previousPending) {
    setPreviousPending(false);
    setShowCompletedButton(true);
    setTimeout(() => {
      if (isMounted) {
        setShowCompletedButton(false);
      }
    }, 3000);
  }

  const value = useMemo(
    () => ({
      transactionAndMessageGroups,
      fetchMoreTransactions,
      canLoadMoreTransactions,
      isLatestTxPending,
      showCompletedButton,
      isUserHubOpen,
      setIsUserHubOpen,
    }),
    [
      transactionAndMessageGroups,
      fetchMoreTransactions,
      canLoadMoreTransactions,
      isLatestTxPending,
      showCompletedButton,
      isUserHubOpen,
      setIsUserHubOpen,
    ],
  );

  return (
    <UserTransactionContext.Provider {...{ value }}>
      {children}
    </UserTransactionContext.Provider>
  );
};

export const useUserTransactionContext = () => {
  const context = useContext(UserTransactionContext);
  if (!context) {
    throw new Error(
      'useUserTransactionContext must be used within a UserTransactionContextProvider',
    );
  }
  return context;
};
