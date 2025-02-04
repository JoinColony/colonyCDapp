import React, {
  useCallback,
  useMemo,
  useState,
  type FC,
  type PropsWithChildren,
} from 'react';

import { useRefetchColonyData, useFundsStateUpdater } from './hooks.ts';
import { IncomingFundsLoadingContext } from './IncomingFundsLoadingContext.ts';
import { type PendingFundsChainTokens } from './types.ts';

export const IncomingFundsLoadingContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const [pendingFundsChainTokens, setPendingFundsChainTokens] =
    useState<PendingFundsChainTokens>([]);

  const enableAcceptLoading = useCallback(() => setIsAcceptLoading(true), []);

  const reset = useCallback(() => {
    setPendingFundsChainTokens([]);
    setIsAcceptLoading(false);
  }, []);

  useFundsStateUpdater(pendingFundsChainTokens, reset);
  useRefetchColonyData(
    isAcceptLoading && !!pendingFundsChainTokens.length,
    reset,
  );

  const value = useMemo(
    () => ({
      isAcceptLoading,
      enableAcceptLoading,
      setPendingFundsChainTokens,
      reset,
    }),
    [isAcceptLoading, enableAcceptLoading, setPendingFundsChainTokens, reset],
  );

  return (
    <IncomingFundsLoadingContext.Provider value={value}>
      {children}
    </IncomingFundsLoadingContext.Provider>
  );
};
