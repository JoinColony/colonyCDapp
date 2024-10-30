import React, {
  useCallback,
  useMemo,
  useState,
  type FC,
  type PropsWithChildren,
} from 'react';

import { IncomingFundsLoadingContext } from './IncomingFundsLoadingContext.ts';

export const IncomingFundsLoadingContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);

  const enableAcceptLoading = useCallback(() => setIsAcceptLoading(true), []);
  const disableAcceptLoading = useCallback(() => setIsAcceptLoading(false), []);

  const value = useMemo(
    () => ({
      isAcceptLoading,
      enableAcceptLoading,
      disableAcceptLoading,
    }),
    [isAcceptLoading, enableAcceptLoading, disableAcceptLoading],
  );

  return (
    <IncomingFundsLoadingContext.Provider value={value}>
      {children}
    </IncomingFundsLoadingContext.Provider>
  );
};
