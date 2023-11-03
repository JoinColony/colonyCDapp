import React, { FC, PropsWithChildren, useMemo } from 'react';

import { MotionContext } from './MotionContext';
import { MotionProviderProps } from './types';

import { useStakingWidgetUpdate } from './hooks';

const MotionProvider: FC<PropsWithChildren<MotionProviderProps>> = ({
  children,
  motionAction,
  startPollingAction,
  stopPollingAction,
}) => {
  const { motionData } = motionAction;
  const { motionStakes } = motionData;
  const [isRefetching, setIsRefetching] = useStakingWidgetUpdate(
    motionStakes,
    stopPollingAction,
  );

  const stakingWidgetValues = useMemo(
    () => ({
      motionAction,
      startPollingAction,
      isRefetching,
      setIsRefetching,
    }),
    [motionAction, startPollingAction, isRefetching, setIsRefetching],
  );

  return (
    <MotionContext.Provider value={stakingWidgetValues}>
      {children}
    </MotionContext.Provider>
  );
};

export default MotionProvider;
