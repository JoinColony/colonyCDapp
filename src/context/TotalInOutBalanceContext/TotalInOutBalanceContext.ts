import { createContext, useContext } from 'react';

export const TotalInOutBalanceContext = createContext<{
  loading: boolean;
  totalIn?: string;
  totalOut?: string;
  previousTotalIn?: string;
  previousTotalOut?: string;
}>({
  loading: false,
  totalIn: '',
  totalOut: '',
  previousTotalIn: '',
  previousTotalOut: '',
});

export const useTotalInOutBalanceContext = () => {
  const context = useContext(TotalInOutBalanceContext);

  if (!context) {
    throw new Error(
      'This hook must be used within the "TotalInOutBalanceContext" provider',
    );
  }

  return context;
};
