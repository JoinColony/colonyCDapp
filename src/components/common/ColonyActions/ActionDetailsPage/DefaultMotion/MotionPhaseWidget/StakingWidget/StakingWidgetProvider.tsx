import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';

import { useAppContext } from '~hooks';
import { MotionData, SetStateFn } from '~types';

export interface StakingWidgetContextValues extends MotionData {
  canBeStaked: boolean;
  isObjection: boolean;
  setIsObjection: SetStateFn;
  isSummary: boolean;
  setIsSummary: SetStateFn;
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
    motionStakes: {
      raw: { nay: nayStakes },
    },
    remainingStakes: [nayRemaining, yayRemaining],
  },
  motionData,
}: StakingWidgetProviderProps) => {
  const { user } = useAppContext();
  const [isObjection, setIsObjection] = useState<boolean>(false);
  const showSummary = Number(nayStakes) > 0;
  const [isSummary, setIsSummary] = useState<boolean>(showSummary);
  const remainingToStake = isObjection ? nayRemaining : yayRemaining;

  // Todo: extend this definition
  const canBeStaked = !!(user && remainingToStake !== '0');

  const stakingWidgetValues = useMemo(
    () => ({
      ...motionData,
      canBeStaked,
      isObjection,
      setIsObjection,
      isSummary,
      setIsSummary,
    }),
    [
      motionData,
      canBeStaked,
      isObjection,
      setIsObjection,
      isSummary,
      setIsSummary,
    ],
  );

  return (
    <StakingWidgetContext.Provider value={stakingWidgetValues}>
      {children}
    </StakingWidgetContext.Provider>
  );
};
