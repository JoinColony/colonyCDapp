import { createContext, useContext } from 'react';

import noop from '~utils/noop.ts';

import { type PendingFundsChainTokens } from './types.ts';

interface IncomingFundsLoadingContextValues {
  isAcceptLoading: boolean;
  enableAcceptLoading: VoidFunction;
  setPendingFundsChainTokens: (
    tokenAddressesGroupedByChain: PendingFundsChainTokens,
  ) => void;
  /**
   * Resets the loading state (`isAcceptLoading`) and the list of token addresses awaiting fund claims to their initial values.
   */
  reset: VoidFunction;
}

export const IncomingFundsLoadingContext =
  createContext<IncomingFundsLoadingContextValues>({
    isAcceptLoading: false,
    enableAcceptLoading: noop,
    setPendingFundsChainTokens: noop,
    reset: noop,
  });

export const useIncomingFundsLoadingContext = () => {
  const context = useContext(IncomingFundsLoadingContext);

  return context;
};
