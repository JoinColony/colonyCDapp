import React, {
  type FC,
  type PropsWithChildren,
  useState,
  useMemo,
} from 'react';

import { ReputationChartContext } from './ReputationChartContext.ts';

export const ReputationChartContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [activeLegendItem, setActiveLegendItem] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      setActiveLegendItem: (id: string) => setActiveLegendItem(id),
      resetActiveLegendItem: () => setActiveLegendItem(null),
      activeLegendItemId: activeLegendItem,
    }),
    [activeLegendItem, setActiveLegendItem],
  );

  return (
    <ReputationChartContext.Provider value={value}>
      {children}
    </ReputationChartContext.Provider>
  );
};
