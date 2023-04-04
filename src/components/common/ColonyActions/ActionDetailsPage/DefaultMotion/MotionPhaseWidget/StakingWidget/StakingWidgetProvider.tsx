import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';

import { useStakingWidgetUpdate } from '~hooks';
import { MotionData, SetStateFn } from '~types';

export interface StakingWidgetContextValues extends MotionData {
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
    motionStakes,
  },
  motionData,
  startPollingAction,
  stopPollingAction,
}: StakingWidgetProviderProps) => {
  const [isObjection, setIsObjection] = useState<boolean>(false);
  const showSummary = Number(nayStakes) > 0;
  const [isSummary, setIsSummary] = useState<boolean>(showSummary);
  const [isRefetching, setIsRefetching] = useStakingWidgetUpdate(
    motionStakes,
    stopPollingAction,
  );

  const stakingWidgetValues = useMemo(
    () => ({
      ...motionData,
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
