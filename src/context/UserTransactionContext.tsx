import { ApolloQueryResult } from '@apollo/client';
import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { useGroupedTransactionsAndMessages } from '~common/Extensions/UserNavigation/hooks';
import {
  isTxGroup,
  TransactionOrMessageGroup,
} from '~frame/GasStation/transactionGroup';
import {
  GetUserTransactionsQuery,
  useGetTransactionsByGroupLazyQuery,
  useUpdateTransactionMutation,
} from '~gql';
import { useAppContext } from '~hooks';
import { CORE_TRANSACTIONS, CORE_TRANSACTIONS_LIST } from '~redux/constants';
import { TransactionType } from '~redux/immutable';
import { TransactionStatus } from '~types';
import { notNull } from '~utils/arrays';

interface UserTransactionContextValues
  extends Omit<
    ReturnType<typeof useGroupedTransactionsAndMessages>,
    'refetchTransactions'
  > {
  groupState: TransactionGroupStates;
}

export const UserTransactionContext =
  createContext<UserTransactionContextValues | null>(null);

export enum TransactionGroupStates {
  Loading = 'Loading',
  NonePending = 'NonePending',
  SomePending = 'SomePending',
  SomeFailed = 'SomeFailed',
  AllCompleted = 'AllCompleted',
}

const useGroupState = ({
  group,
  isUpdatingGroup,
}: {
  group?: TransactionOrMessageGroup;
  isUpdatingGroup: boolean;
}) => {
  const [previousPending, setPreviousPending] = useState(false);
  const [groupState, setGroupState] = useState<TransactionGroupStates>(
    TransactionGroupStates.NonePending,
  );

  if (!group) {
    return groupState;
  }

  const someFailed = group.some((tx) => tx.status === TransactionStatus.Failed);
  const allCompleted = group.every(
    (tx) => tx.status === TransactionStatus.Succeeded,
  );
  const hasLatestGroupPendingTx = group.some(
    (tx) => tx.status === TransactionStatus.Pending,
  );

  if (isUpdatingGroup) {
    if (groupState !== TransactionGroupStates.Loading) {
      setGroupState(TransactionGroupStates.Loading);
    }
  } else if (someFailed && groupState !== TransactionGroupStates.SomeFailed) {
    setGroupState(TransactionGroupStates.SomeFailed);
  } else if (
    allCompleted &&
    previousPending &&
    groupState !== TransactionGroupStates.AllCompleted
  ) {
    setPreviousPending(false);
    setGroupState(TransactionGroupStates.AllCompleted);
    setTimeout(() => {
      setGroupState((prevState) => {
        // don't reset if the state has changed in the meantime
        if (prevState === TransactionGroupStates.AllCompleted) {
          return TransactionGroupStates.NonePending;
        }

        return prevState;
      });
    }, 3000);
  } else if (
    hasLatestGroupPendingTx &&
    groupState !== TransactionGroupStates.SomePending
  ) {
    if (!previousPending) {
      setPreviousPending(true);
    }
    setGroupState(TransactionGroupStates.SomePending);
  }

  return groupState;
};

const getTransactionFromStore = (id?: string) => (state) => {
  if (!id) {
    return null;
  }

  return state.getIn([CORE_TRANSACTIONS, CORE_TRANSACTIONS_LIST, id]);
};

const useFailPendingTransactions = ({
  group,
  refetchTransactions,
}: {
  group: TransactionOrMessageGroup;
  refetchTransactions: () => Promise<
    ApolloQueryResult<GetUserTransactionsQuery>
  >;
}) => {
  const { user } = useAppContext();
  const groupRef = useRef<string>();

  const [getTransactions] = useGetTransactionsByGroupLazyQuery();
  const [updateTransaction] = useUpdateTransactionMutation();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const transactionId = group && isTxGroup(group) ? group[0].id : undefined;

  // If the transaction is in the store, we can assume the session state has not been reset
  const firstTx: TransactionOrMessageGroup[0] | undefined = useSelector(
    getTransactionFromStore(transactionId),
  );

  useEffect(() => {
    const failPendingTransactions = async (userAddress: string) => {
      const groupId = (group[0] as TransactionType).group?.id.toString();
      if (groupId) {
        // if the "group" is a proper group (and not just an array with a single, non-grouped transaction)
        // get all transactions in the group, and set the status of the pending ones to "FAILED".
        const { data } = await getTransactions({
          variables: {
            from: userAddress,
            groupId,
          },
        });

        const transactions = (
          data?.getTransactionsByUserAndGroup?.items ?? []
        ).filter(notNull);

        await Promise.allSettled(
          transactions.map(async (transaction) => {
            if (transaction.status === TransactionStatus.Pending) {
              return updateTransaction({
                variables: {
                  input: {
                    id: transaction.id,
                    status: TransactionStatus.Failed,
                  },
                },
              });
            }

            return null;
          }),
        );
      } else if (group[0].status === TransactionStatus.Pending) {
        // else if we're dealing with a single pending transaction,
        // updates its status to failed.
        await updateTransaction({
          variables: {
            input: { id: group[0].id, status: TransactionStatus.Failed },
          },
        });
      }
      await refetchTransactions();
      setIsLoading(false);
    };

    if (!firstTx && group && groupRef.current !== group[0].id && user) {
      setIsLoading(true);
      groupRef.current = group[0].id;
      failPendingTransactions(user.walletAddress);
    }
  }, [
    firstTx,
    group,
    getTransactions,
    refetchTransactions,
    updateTransaction,
    user,
  ]);

  return { isLoading };
};

export const UserTransactionContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const {
    transactionAndMessageGroups,
    fetchMoreTransactions,
    canLoadMoreTransactions,
    refetchTransactions,
  } = useGroupedTransactionsAndMessages();

  const firstGroup: TransactionOrMessageGroup | undefined =
    transactionAndMessageGroups[0];

  // We should cleanup any previous transactions left pending.
  // We can assume they'll only be in the first group, since all previous groups should've already been cleaned up.
  const { isLoading } = useFailPendingTransactions({
    group: firstGroup,
    refetchTransactions,
  });

  const groupState = useGroupState({
    group: firstGroup,
    isUpdatingGroup: isLoading,
  });

  const value = useMemo(
    () => ({
      transactionAndMessageGroups,
      fetchMoreTransactions,
      canLoadMoreTransactions,
      groupState,
    }),
    [
      transactionAndMessageGroups,
      fetchMoreTransactions,
      canLoadMoreTransactions,
      groupState,
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
