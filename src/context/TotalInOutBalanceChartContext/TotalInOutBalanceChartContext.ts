import { createContext, useContext } from 'react';

import { type DomainBalanceReturn } from '~gql';

export const TotalInOutBalanceChartContext = createContext<
  {
    loading: boolean;
    timeframe:
      | {
          label: string;
          in: string;
          out: string;
        }[]
      | undefined
      | null;
    ySteps: number[];
  } & Omit<DomainBalanceReturn, 'timeframe'>
>({
  total: null,
  totalIn: null,
  totalOut: null,
  timeframe: null,
  loading: false,
  ySteps: [],
});

export const useTotalInOutBalanceChartContext = () => {
  const context = useContext(TotalInOutBalanceChartContext);

  if (!context) {
    throw new Error(
      'This hook must be used within the "TotalInOutBalanceChartContext" provider',
    );
  }

  return context;
};
