import React, {
  useCallback,
  useMemo,
  useState,
  type FC,
  type PropsWithChildren,
} from 'react';

import { useRefetchColonyData, useFundsStateUpdater } from './hooks.ts';
import { IncomingFundsLoadingContext } from './IncomingFundsLoadingContext.ts';

export const IncomingFundsLoadingContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const [pendingFundsTokenAddresses, setPendingFundsTokenAddresses] = useState<
    string[]
  >([]);

  const enableAcceptLoading = useCallback(() => setIsAcceptLoading(true), []);

  const reset = useCallback(() => {
    setPendingFundsTokenAddresses([]);
    setIsAcceptLoading(false);
  }, []);

  useFundsStateUpdater(pendingFundsTokenAddresses, reset);
  useRefetchColonyData(
    isAcceptLoading && !!pendingFundsTokenAddresses.length,
    reset,
  );

  const value = useMemo(
    () => ({
      isAcceptLoading,
      enableAcceptLoading,
      setPendingFundsTokenAddresses,
      reset,
    }),
    [
      isAcceptLoading,
      enableAcceptLoading,
      setPendingFundsTokenAddresses,
      reset,
    ],
  );

  return (
    <IncomingFundsLoadingContext.Provider value={value}>
      {children}
    </IncomingFundsLoadingContext.Provider>
  );
};
