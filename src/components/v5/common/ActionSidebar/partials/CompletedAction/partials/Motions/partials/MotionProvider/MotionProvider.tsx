import React, { type FC, type PropsWithChildren, useMemo } from 'react';

import { useStakingWidgetUpdate } from './hooks.ts';
import { MotionContext } from './MotionContext.ts';
import { type MotionProviderProps } from './types.ts';

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
