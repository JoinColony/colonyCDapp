import { type MutableRefObject, useEffect, useRef, useState } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useGlobalTriggersContext } from '~context/GlobalTriggersContext/GlobalTriggersContext.ts';
import { type MotionStakes, useGetMotionTimeoutPeriodsQuery } from '~gql';
import { type TimerValueProps } from '~shared/TimerValue/TimerValue.tsx';
import { MotionState } from '~utils/colonyMotions.ts';
import { getSafePollingInterval } from '~utils/queries.ts';

import { getCurrentStatePeriodInMs, splitTimeLeft } from './helpers.ts';

const pollInterval = getSafePollingInterval();

const useMotionTimeoutPeriods = (colonyAddress: string, motionId: string) => {
  const { data, loading, refetch } = useGetMotionTimeoutPeriodsQuery({
    variables: { input: { colonyAddress, motionId } },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });
  const motionTimeoutPeriods = data?.getMotionTimeoutPeriods || {
    timeLeftToEscalate: '-1',
    timeLeftToVote: '-1',
    timeLeftToReveal: '-1',
    timeLeftToStake: '-1',
  };

  return {
    motionTimeoutPeriods,
    loadingMotionTimeoutPeriods: loading,
    refetchMotionTimeoutPeriods: refetch,
  };
};

export const useMotionCountdown = ({
  state,
  motionId,
  refetchMotionState,
  motionStakes,
}: {
  state: MotionState;
  motionId: string;
  refetchMotionState: VoidFunction;
  motionStakes: MotionStakes;
}): {
  timeLeft: number;
  countdown: Exclude<TimerValueProps['splitTime'], undefined>;
  isLoading: boolean;
} => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { percentage: percentageStaked } = motionStakes;
  const isAnySideFullyStaked =
    percentageStaked.nay === '100' || percentageStaked.yay === '100';

  const {
    motionTimeoutPeriods,
    loadingMotionTimeoutPeriods,
    refetchMotionTimeoutPeriods,
  } = useMotionTimeoutPeriods(colony.colonyAddress, motionId);

  const currentStatePeriodInMs = getCurrentStatePeriodInMs(
    state,
    motionTimeoutPeriods,
  );

  const [timeLeft, setTimeLeft] = useState<number>(-1);

  const { setActionsTableTriggers } = useGlobalTriggersContext();

  const prevStateRef: MutableRefObject<MotionState | null> = useRef(null);
  const isStakingPhaseState =
    state === MotionState.Staking ||
    state === MotionState.Supported ||
    state === MotionState.Opposed;

  /*
   * Set the initial timeout
   *
   * @NOTE The extra 5 seconds are to account for the time in between the blockchain
   * timeout being hit and the next block being processed.
   *
   * If there are no blockes being processes between the time the motion "should" finish
   * and the time we refresh the state (because we are basically keeping a parallel time count)
   * the state of the motion won't change.
   *
   * This is confusing UX and might need revisiting in the future with some clever messages
   * for the user to let them know what's going on
   *
   * So we are "faking" this by adding an extra 5 to the alloted time, so that the
   * blockchain has time to process any transactions, detect the motion's timeout,
   * and change the state so we can refresh it.
   */
  useEffect(() => {
    if (
      !loadingMotionTimeoutPeriods &&
      /*  @NOTE: If we have loaded the motion timeout periods, we should only set/reset the timer:
       *
       *  !isStakingPhaseState - If the current motion state is not related to the staking phase. (voting phase, reveal phase, etc.).
       *  We do this in case the motion state changes from 1 phase to another one while the user is in the motion page (Goes from staking to voting, for example).
       *
       *  OR
       *
       *  isStakingPhaseState - If the current motion state is a staking phase but:
       *    isAnySideFullyStaked - The YAY or NAY  side is fully staked (For example, if the user fully staked the NAY side, the timer should reset).
       *    revStateRef.current === null - There's no previous reference of a timer, therefore, the user just loaded/reloaded the motion page and this is the "initial" timer.
       */
      (!isStakingPhaseState ||
        (isStakingPhaseState &&
          (isAnySideFullyStaked || prevStateRef.current === null)))
    ) {
      const currentStatePeriodInSeconds = Number(currentStatePeriodInMs) / 1000;

      setTimeLeft(
        currentStatePeriodInSeconds > 0
          ? currentStatePeriodInSeconds + 5
          : currentStatePeriodInSeconds,
      );
      prevStateRef.current = state;
    }
  }, [
    currentStatePeriodInMs,
    loadingMotionTimeoutPeriods,
    prevStateRef,
    state,
    isStakingPhaseState,
    isAnySideFullyStaked,
  ]);

  /*
   * Count it down
   */
  useEffect(() => {
    let motionStatePollTimer: NodeJS.Timeout;

    const timer = setInterval(() => {
      setTimeLeft((oldTimeLeft) => oldTimeLeft - 1);
    }, 1000);

    if (timeLeft === 0) {
      clearInterval(timer);

      motionStatePollTimer = setInterval(() => {
        refetchMotionState();

        setActionsTableTriggers((triggers) => ({
          ...triggers,
          shouldRefetchMotionStates: true,
        }));
      }, pollInterval);
    }

    return () => {
      clearInterval(timer);

      if (motionStatePollTimer) {
        clearInterval(motionStatePollTimer);
      }
    };
  }, [
    timeLeft,
    currentStatePeriodInMs,
    colony,
    motionId,
    user,
    refetchMotionState,
    setActionsTableTriggers,
  ]);

  useEffect(() => {
    if (!isStakingPhaseState || isAnySideFullyStaked) {
      refetchMotionTimeoutPeriods();
    }
  }, [
    isStakingPhaseState,
    refetchMotionTimeoutPeriods,
    state,
    isAnySideFullyStaked,
  ]);

  /*
   * Split the time into h/m/s for display purpouses
   */
  const splitTime = splitTimeLeft(timeLeft);

  return {
    timeLeft,
    countdown: splitTime,
    isLoading: loadingMotionTimeoutPeriods,
  };
};
