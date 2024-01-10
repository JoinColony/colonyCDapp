import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react';

import { GetUserTokenBalanceReturn, useGetUserTokenBalanceQuery } from '~gql';
import { useAppContext, useColonyContext } from '~hooks';

export const UserTokenBalanceContext = createContext<{
  tokenBalanceData: GetUserTokenBalanceReturn | null | undefined;
  loading: boolean;
  pollActiveTokenBalance: () => void;
  pollLockedTokenBalance: () => void;
  refetchTokenBalances: () => void;
}>({
  tokenBalanceData: null,
  loading: false,
  refetchTokenBalances: () => {},
  pollActiveTokenBalance: () => {},
  pollLockedTokenBalance: () => {},
});

export const UserTokenBalanceProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { wallet } = useAppContext();
  const {
    colony: { colonyAddress, nativeToken },
  } = useColonyContext();

  const {
    data: tokenBalanceQueryData,
    refetch,
    loading,
  } = useGetUserTokenBalanceQuery({
    variables: {
      input: {
        walletAddress: wallet?.address ?? '',
        tokenAddress: nativeToken.tokenAddress,
        colonyAddress,
      },
    },
    skip: !wallet?.address,
  });

  const tokenBalanceData = tokenBalanceQueryData?.getUserTokenBalance;

  /*
   * Custom polling functions ensure that they don't interfere with one another.
   * If you used startPoll & stopPoll, a call to stopPoll would cancel all polling, so if you were polling
   * more than one balance simultaneously, you'd not see the updates in the UI you'd be expecting.
   */
  const pollActiveTokenBalance = useCallback(() => {
    let interval;

    const fetchActiveBalance = async () => {
      const { data } = await refetch();
      const activeBalance = data.getUserTokenBalance?.activeBalance;
      if (activeBalance !== tokenBalanceData?.activeBalance) {
        clearInterval(interval);
      }
    };

    interval = setInterval(fetchActiveBalance, 3_000);
  }, [tokenBalanceData, refetch]);

  const pollLockedTokenBalance = useCallback(async () => {
    let interval;

    const fetchLockedBalance = async () => {
      const { data } = await refetch();
      const lockedBalance = data.getUserTokenBalance?.lockedBalance;
      if (lockedBalance !== tokenBalanceData?.lockedBalance) {
        clearInterval(interval);
      }
    };

    interval = setInterval(fetchLockedBalance, 3_000);
  }, [tokenBalanceData, refetch]);

  const value = useMemo(
    () => ({
      tokenBalanceData,
      loading,
      refetchTokenBalances: refetch,
      pollActiveTokenBalance,
      pollLockedTokenBalance,
    }),
    [
      tokenBalanceData,
      refetch,
      pollActiveTokenBalance,
      pollLockedTokenBalance,
      loading,
    ],
  );

  return (
    <UserTokenBalanceContext.Provider value={value}>
      {children}
    </UserTokenBalanceContext.Provider>
  );
};

export const useUserTokenBalanceContext = () => {
  const context = useContext(UserTokenBalanceContext);

  if (!context) {
    throw new Error(
      'This hook must be used within the "UserTokenBalanceContext" provider',
    );
  }

  return context;
};
