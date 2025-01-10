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
  const [isFundsUpdatePending, setIsFundsUpdatePending] = useState(false);

  const enableAcceptLoading = useCallback(() => setIsAcceptLoading(true), []);
  const enableIsFundsUpdatePending = useCallback(
    () => setIsFundsUpdatePending(true),
    [],
  );

  const reset = useCallback(() => {
    setIsAcceptLoading(false);
    setIsFundsUpdatePending(false);
  }, []);

  useFundsStateUpdater(isFundsUpdatePending, reset);
  useRefetchColonyData(isAcceptLoading, reset);

  const value = useMemo(
    () => ({
      isAcceptLoading,
      enableAcceptLoading,
      isFundsUpdatePending,
      enableIsFundsUpdatePending,
      reset,
    }),
    [
      isAcceptLoading,
      enableAcceptLoading,
      isFundsUpdatePending,
      enableIsFundsUpdatePending,
      reset,
    ],
  );

  return (
    <IncomingFundsLoadingContext.Provider value={value}>
      {children}
    </IncomingFundsLoadingContext.Provider>
  );
};
