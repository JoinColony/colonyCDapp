import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  GetMotionTimeoutPeriodsReturn,
  useGetMotionTimeoutPeriodsQuery,
} from '~gql';
import { RefetchMotionState, useAppContext, useColonyContext } from '~hooks';
import { MotionState } from '~utils/colonyMotions';
import { MotionData } from '~types';

const splitTimeLeft = (period: number) => {
  if (period > 0) {
    return {
      days: Math.floor(period / (60 * 60 * 24)),
      hours: Math.floor((period / (60 * 60)) % 24),
      minutes: Math.floor((period / 60) % 60),
      seconds: Math.floor(period % 60),
    };
  }
  return undefined;
};

const getCurrentStatePeriodInMs = (
  motionState: MotionState,
  motionTimeoutPeriods: GetMotionTimeoutPeriodsReturn,
) => {
  switch (motionState) {
    case MotionState.Staking:
    case MotionState.Staked:
    case MotionState.Objection:
      return motionTimeoutPeriods.timeLeftToStake;
    case MotionState.Voting:
      return motionTimeoutPeriods.timeLeftToVote;
    case MotionState.Reveal:
      return motionTimeoutPeriods.timeLeftToReveal;
    case MotionState.Escalation:
      return motionTimeoutPeriods.timeLeftToEscalate;
    default:
      return '-1';
  }
};

const useMotionTimeoutPeriods = (colonyAddress = '', motionId: string) => {
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

export const useMotionCountdown = (
  state: MotionState,
  motionId: string,
  refetchMotionState: RefetchMotionState,
  motionStakes: MotionData['motionStakes'],
) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const dispatch = useDispatch();
  const { percentage: percentageStaked } = motionStakes;
  const isAnySideFullyStaked =
    percentageStaked.nay === '100' || percentageStaked.yay === '100';

  const {
    motionTimeoutPeriods,
    loadingMotionTimeoutPeriods,
    refetchMotionTimeoutPeriods,
  } = useMotionTimeoutPeriods(colony?.colonyAddress, motionId);

  const currentStatePeriodInMs = getCurrentStatePeriodInMs(
    state,
    motionTimeoutPeriods,
  );

  const [timeLeft, setTimeLeft] = useState<number>(-1);

  const prevStateRef: MutableRefObject<MotionState | null> = useRef(null);
  const isStakingPhaseState =
    state === MotionState.Staking ||
    state === MotionState.Staked ||
    state === MotionState.Objection;

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
    const timer = setInterval(() => {
      setTimeLeft((oldTimeLeft) => oldTimeLeft - 1);
    }, 1000);

    if (timeLeft === 0) {
      refetchMotionState();
    }

    if (timeLeft < 0) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [
    timeLeft,
    currentStatePeriodInMs,
    dispatch,
    colony,
    motionId,
    user,
    refetchMotionState,
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
    countdown: splitTime,
    loadingCountdown: loadingMotionTimeoutPeriods,
  };
};
