import { useContext, useState, useEffect } from 'react';

import { SetStateFn, MotionStakes } from '~types';

import { compareMotionStakes } from './helpers';
import { MotionContext } from './MotionContext';

export const useMotionContext = () => {
  const context = useContext(MotionContext);

  if (!context) {
    throw new Error('Could not find MotionContext');
  }

  return context;
};

export const useStakingWidgetUpdate = (
  motionStakes: MotionStakes,
  stopPollingAction: () => void,
): [boolean, SetStateFn<boolean>] => {
  const [isRefetching, setIsRefetching] = useState(false);
  const [prevStakes, setPrevMotionStakes] = useState(motionStakes);

  useEffect(() => {
    const haveChanged = compareMotionStakes(prevStakes, motionStakes);

    if (haveChanged) {
      setIsRefetching(false);
      setPrevMotionStakes(motionStakes);
      stopPollingAction();
    }
  }, [motionStakes, prevStakes, setIsRefetching, stopPollingAction]);

  return [isRefetching, setIsRefetching];
};
