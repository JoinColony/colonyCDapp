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
  pollActiveTokenBalance: () => void;
  pollLockedTokenBalance: () => void;
}>({
  tokenBalanceData: null,
  pollActiveTokenBalance: () => {},
  pollLockedTokenBalance: () => {},
});

export const UserTokenBalanceProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { wallet } = useAppContext();
  const { colony } = useColonyContext();
  const { colonyAddress, nativeToken } = colony || {};

  const { data: tokenBalanceQueryData, refetch } = useGetUserTokenBalanceQuery({
    variables: {
      input: {
        walletAddress: wallet?.address ?? '',
        tokenAddress: nativeToken?.tokenAddress ?? '',
        colonyAddress: colonyAddress ?? '',
      },
    },
    skip: !wallet?.address || !nativeToken?.tokenAddress,
  });

  const tokenBalanceData = tokenBalanceQueryData?.getUserTokenBalance;

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
      pollActiveTokenBalance,
      pollLockedTokenBalance,
    }),
    [tokenBalanceData, pollActiveTokenBalance, pollLockedTokenBalance],
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
