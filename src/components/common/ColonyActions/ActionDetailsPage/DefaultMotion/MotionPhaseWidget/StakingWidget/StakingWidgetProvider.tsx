import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { useAppContext } from '~hooks';
import { MotionData } from '~types';

export interface StakingWidgetContextValues extends MotionData {
  canBeStaked: boolean;
}

const StakingWidgetContext = createContext<
  StakingWidgetContextValues | undefined
>(undefined);

export const useStakingWidgetContext = () => {
  const ctx = useContext(StakingWidgetContext);

  if (!ctx) {
    throw new Error('Could not find StakingWidgetContext');
  }

  return ctx;
};

interface StakingWidgetProviderProps {
  children: ReactNode;
  motionData: MotionData;
}

export const StakingWidgetProvider = ({
  children,
  motionData: {
    remainingStakes: [nayRemaining, yayRemaining],
  },
  motionData,
}: StakingWidgetProviderProps) => {
  const { user } = useAppContext();
  const isObjection = false;
  const remainingToStake = isObjection ? nayRemaining : yayRemaining;

  // Todo: extend this definition
  const canBeStaked = !!(user && remainingToStake !== '0');

  const stakingWidgetValues = useMemo(
    () => ({
      ...motionData,
      canBeStaked,
    }),
    [motionData, canBeStaked],
  );

  return (
    <StakingWidgetContext.Provider value={stakingWidgetValues}>
      {children}
    </StakingWidgetContext.Provider>
  );
};
