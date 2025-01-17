import React, { type FC, type PropsWithChildren, useMemo } from 'react';

import { type ICompletedMotionAction } from '~v5/common/ActionSidebar/partials/Motions/types.ts';

import { useStakingWidgetUpdate } from './hooks.ts';
import { MotionContext } from './MotionContext.ts';

const MotionProvider: FC<PropsWithChildren<ICompletedMotionAction>> = ({
  children,
  motionData,
  action,
}) => {
  const { motionStakes } = motionData;
  const [isRefetching, setIsRefetching] = useStakingWidgetUpdate(motionStakes);

  const stakingWidgetValues = useMemo(
    () => ({
      motionData,
      isRefetching,
      setIsRefetching,
      action,
    }),
    [action, isRefetching, motionData, setIsRefetching],
  );

  return (
    <MotionContext.Provider value={stakingWidgetValues}>
      {children}
    </MotionContext.Provider>
  );
};

export default MotionProvider;
