import React, { type FC, type PropsWithChildren, useMemo } from 'react';

import { useStakingWidgetUpdate } from './hooks.ts';
import { MotionContext } from './MotionContext.ts';
import { type MotionProviderProps } from './types.ts';

const MotionProvider: FC<PropsWithChildren<MotionProviderProps>> = ({
  children,
  motionAction,
}) => {
  const { motionData } = motionAction;
  const { motionStakes } = motionData;
  const [isRefetching, setIsRefetching] = useStakingWidgetUpdate(motionStakes);

  const stakingWidgetValues = useMemo(
    () => ({
      motionAction,
      isRefetching,
      setIsRefetching,
    }),
    [motionAction, isRefetching, setIsRefetching],
  );

  return (
    <MotionContext.Provider value={stakingWidgetValues}>
      {children}
    </MotionContext.Provider>
  );
};

export default MotionProvider;
