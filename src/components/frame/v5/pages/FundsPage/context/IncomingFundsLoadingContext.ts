import { createContext, useContext } from 'react';

interface IncomingFundsLoadingContextValues {
  isAcceptLoading: boolean;
  enableAcceptLoading: () => void;
  disableAcceptLoading: () => void;
}

export const IncomingFundsLoadingContext =
  createContext<IncomingFundsLoadingContextValues>({
    isAcceptLoading: false,
    enableAcceptLoading: () => {},
    disableAcceptLoading: () => {},
  });

export const useIncomingFundsLoadingContext = () => {
  const context = useContext(IncomingFundsLoadingContext);

  return context;
};
