import { createContext, useContext } from 'react';

import noop from '~utils/noop.ts';

interface IncomingFundsLoadingContextValues {
  isAcceptLoading: boolean;
  enableAcceptLoading: VoidFunction;
  isFundsUpdatePending: boolean;
  enableIsFundsUpdatePending: VoidFunction;
  /**
   * Resets all loading-related states (`isAcceptLoading` and `waitForClaimUpdate`)
   * to their initial values.
   */
  reset: VoidFunction;
}

export const IncomingFundsLoadingContext =
  createContext<IncomingFundsLoadingContextValues>({
    isAcceptLoading: false,
    enableAcceptLoading: noop,
    isFundsUpdatePending: false,
    enableIsFundsUpdatePending: noop,
    reset: noop,
  });

export const useIncomingFundsLoadingContext = () => {
  const context = useContext(IncomingFundsLoadingContext);

  return context;
};
