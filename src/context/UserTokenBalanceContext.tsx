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
  pollTokenBalance: () => void;
}>({
  tokenBalanceData: null,
  pollTokenBalance: () => {},
});

export const UserTokenBalanceProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { wallet } = useAppContext();
  const { colony } = useColonyContext();
  const { colonyAddress, nativeToken } = colony || {};

  const {
    data: tokenBalanceQueryData,
    startPolling,
    stopPolling,
  } = useGetUserTokenBalanceQuery({
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

  const pollTokenBalance = useCallback(() => {
    startPolling(1000);
    setTimeout(stopPolling, 10_000);
  }, [startPolling, stopPolling]);

  const value = useMemo(
    () => ({
      tokenBalanceData,
      pollTokenBalance,
    }),
    [tokenBalanceData, pollTokenBalance],
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
