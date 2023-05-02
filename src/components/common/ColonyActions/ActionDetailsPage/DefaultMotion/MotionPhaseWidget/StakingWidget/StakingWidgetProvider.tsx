import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';

import { MotionData, SetStateFn } from '~types';

import useStakingWidgetUpdate from './useStakingWidgetUpdate';

export interface StakingWidgetContextValues extends MotionData {
  remainingToStake: string;
  isObjection: boolean;
  setIsObjection: SetStateFn;
  isSummary: boolean;
  setIsSummary: SetStateFn;
  isRefetching: boolean;
  setIsRefetching: SetStateFn;
  startPollingAction: (pollingInterval: number) => void;
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
  startPollingAction: (pollingInterval: number) => void;
  stopPollingAction: () => void;
}

export const StakingWidgetProvider = ({
  children,
  motionData: {
    motionStakes: {
      raw: { nay: nayStakes },
    },
    remainingStakes: [nayRemaining, yayRemaining],
    motionStakes,
  },
  motionData,
  startPollingAction,
  stopPollingAction,
}: StakingWidgetProviderProps) => {
  const [isObjection, setIsObjection] = useState<boolean>(false);
  const showSummary = Number(nayStakes) > 0;
  const [isSummary, setIsSummary] = useState<boolean>(showSummary);
  const remainingToStake = isObjection ? nayRemaining : yayRemaining;
  const [isRefetching, setIsRefetching] = useStakingWidgetUpdate(
    motionStakes,
    stopPollingAction,
  );

  const stakingWidgetValues = useMemo(
    () => ({
      ...motionData,
      remainingToStake,
      startPollingAction,
      isObjection,
      setIsObjection,
      isSummary,
      setIsSummary,
      isRefetching,
      setIsRefetching,
    }),
    [
      motionData,
      remainingToStake,
      startPollingAction,
      isObjection,
      setIsObjection,
      isSummary,
      setIsSummary,
      isRefetching,
      setIsRefetching,
    ],
  );

  return (
    <StakingWidgetContext.Provider value={stakingWidgetValues}>
      {children}
    </StakingWidgetContext.Provider>
  );
};
