import { createContext, useContext } from 'react';

import noop from '~utils/noop.ts';

interface IncomingFundsLoadingContextValues {
  isAcceptLoading: boolean;
  enableAcceptLoading: VoidFunction;
  setPendingFundsTokenAddresses: (tokenAddresses: string[]) => void;
  /**
   * Resets the loading state (`isAcceptLoading`) and the list of token addresses awaiting fund claims to their initial values.
   */
  reset: VoidFunction;
}

export const IncomingFundsLoadingContext =
  createContext<IncomingFundsLoadingContextValues>({
    isAcceptLoading: false,
    enableAcceptLoading: noop,
    setPendingFundsTokenAddresses: noop,
    reset: noop,
  });

export const useIncomingFundsLoadingContext = () => {
  const context = useContext(IncomingFundsLoadingContext);

  return context;
};
