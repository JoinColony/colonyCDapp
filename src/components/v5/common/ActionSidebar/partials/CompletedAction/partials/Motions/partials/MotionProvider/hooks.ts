import { useApolloClient } from '@apollo/client';
import { useContext, useState, useEffect } from 'react';

import { SearchActionsDocument } from '~gql';
import { type MotionStakes } from '~types/graphql.ts';
import { type SetStateFn } from '~types/index.ts';
import { isQueryActive } from '~utils/isQueryActive.ts';

import {
  compareMotionStakes,
  hasMotionJustPassedThreshold,
} from './helpers.ts';
import { MotionContext } from './MotionContext.ts';

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

  const client = useApolloClient();

  useEffect(() => {
    const haveChanged = compareMotionStakes(prevStakes, motionStakes);

    if (!haveChanged) {
      return;
    }

    const motionJustPassedThreshold = hasMotionJustPassedThreshold(
      prevStakes,
      motionStakes,
    );

    setIsRefetching(false);
    setPrevMotionStakes(motionStakes);
    stopPollingAction();

    if (!motionJustPassedThreshold) {
      return;
    }

    // Only need to refetch SearchActions if the motion has just passed the threshold and become public
    if (isQueryActive('SearchActions')) {
      client.refetchQueries({
        include: [SearchActionsDocument],
      });
    }
  }, [motionStakes, prevStakes, setIsRefetching, stopPollingAction, client]);

  return [isRefetching, setIsRefetching];
};
