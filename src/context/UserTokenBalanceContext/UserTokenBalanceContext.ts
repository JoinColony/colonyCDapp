import { createContext, useContext } from 'react';

import { type GetUserTokenBalanceReturn } from '~gql';

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

export const useUserTokenBalanceContext = () => {
  const context = useContext(UserTokenBalanceContext);

  if (!context) {
    throw new Error(
      'This hook must be used within the "UserTokenBalanceContext" provider',
    );
  }

  return context;
};
