import { useState, useEffect } from 'react';

import { MotionStakes } from '~gql';
import { SetStateFn } from '~types';

const compareMotionStakes = (
  oldMotionStakes: MotionStakes,
  newMotionStates: MotionStakes | undefined,
) =>
  oldMotionStakes.raw.yay !== newMotionStates?.raw.yay ||
  oldMotionStakes.raw.nay !== newMotionStates?.raw.nay;

const useStakingWidgetUpdate = (
  motionStakes: MotionStakes,
  stopPollingAction: () => void,
): [boolean, SetStateFn] => {
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

export default useStakingWidgetUpdate;
