import { createContext, useContext } from 'react';

export const ReputationChartContext = createContext<
  | {
      setActiveLegendItem: (id: string) => void;
      resetActiveLegendItem: () => void;
      activeLegendItemId: string | null;
    }
  | undefined
>(undefined);

export const useReputationChartContext = () => {
  const context = useContext(ReputationChartContext);
  if (context === undefined) {
    throw new Error(
      'useReputationChartContext must be used within the ReputationChartContext',
    );
  }
  return context;
};
