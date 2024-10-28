import { createContext, useContext } from 'react';

import noop from '~utils/noop.ts';

interface IncomingFundsLoadingContextValues {
  isAcceptLoading: boolean;
  enableAcceptLoading: () => void;
  disableAcceptLoading: () => void;
}

export const IncomingFundsLoadingContext =
  createContext<IncomingFundsLoadingContextValues>({
    isAcceptLoading: false,
    enableAcceptLoading: noop,
    disableAcceptLoading: noop,
  });

export const useIncomingFundsLoadingContext = () => {
  const context = useContext(IncomingFundsLoadingContext);

  return context;
};
