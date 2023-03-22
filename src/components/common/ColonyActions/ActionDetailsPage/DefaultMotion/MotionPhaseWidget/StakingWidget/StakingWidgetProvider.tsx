import React, { createContext, ReactNode, useContext, useMemo } from 'react';

export interface StakingWidgetContextValues {}

const StakingWidgetContext = createContext<Partial<StakingWidgetContextValues>>(
  {},
);

export const useStakingWidgetContext = () => {
  const ctx = useContext(StakingWidgetContext);

  if (!Object.keys(ctx).length) {
    throw new Error('Could not find StakingWidgetContext');
  }

  return ctx as StakingWidgetContextValues;
};

interface StakingWidgetProviderProps {
  children: ReactNode;
}

export const StakingWidgetProvider = ({
  children,
}: StakingWidgetProviderProps) => {
  const stakingWidgetValues = useMemo(() => ({}), []);
  return (
    <StakingWidgetContext.Provider value={stakingWidgetValues}>
      {children}
    </StakingWidgetContext.Provider>
  );
};
