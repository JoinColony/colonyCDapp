import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { MotionData } from '~types';

export type StakingWidgetContextValues = MotionData;

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
  motionData: MotionData;
}

export const StakingWidgetProvider = ({
  children,
  motionData,
}: StakingWidgetProviderProps) => {
  const stakingWidgetValues = useMemo(
    () => ({
      ...motionData,
    }),
    [motionData],
  );

  return (
    <StakingWidgetContext.Provider value={stakingWidgetValues}>
      {children}
    </StakingWidgetContext.Provider>
  );
};
