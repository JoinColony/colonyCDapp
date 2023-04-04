import { BigNumber } from 'ethers';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  GetMotionTimeoutPeriodsReturn,
  useGetMotionTimeoutPeriodsQuery,
} from '~gql';
import { useAppContext, useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import { MotionState } from '~utils/colonyMotions';

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

const getCurrentStatePeriod = (
  motionState: MotionState,
  motionTimeoutPeriods: GetMotionTimeoutPeriodsReturn,
) => {
  switch (motionState) {
    case MotionState.Staking:
    case MotionState.Staked:
    case MotionState.Objection:
      return motionTimeoutPeriods.timeLeftToStake;
    case MotionState.Voting:
      return motionTimeoutPeriods.timeLeftToSubmit;
    case MotionState.Reveal:
      return motionTimeoutPeriods.timeLeftToReveal;
    case MotionState.Escalation:
      return motionTimeoutPeriods.timeLeftToEscalate;
    default:
      return '-1';
  }
};

const useMotionTimeoutPeriods = (colonyAddress = '', motionId: number) => {
  const { data, loading, refetch } = useGetMotionTimeoutPeriodsQuery({
    variables: { input: { colonyAddress, motionId } },
  });
  const motionTimeoutPeriods = data?.getMotionTimeoutPeriods || {
    timeLeftToEscalate: '-1',
    timeLeftToSubmit: '-1',
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
  motionId: number,
  isFullyNayStaked: boolean,
) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const dispatch = useDispatch();

  const {
    motionTimeoutPeriods,
    loadingMotionTimeoutPeriods,
    refetchMotionTimeoutPeriods,
  } = useMotionTimeoutPeriods(colony?.colonyAddress, motionId);

  const currentStatePeriod = getCurrentStatePeriod(state, motionTimeoutPeriods);

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
      (!isStakingPhaseState ||
        (isStakingPhaseState &&
          (isFullyNayStaked || prevStateRef.current === null)))
    ) {
      const period = Number(currentStatePeriod) / 1000;

      setTimeLeft(period > 0 ? period + 5 : period);
      prevStateRef.current = state;
    }
  }, [
    currentStatePeriod,
    prevStateRef,
    state,
    isStakingPhaseState,
    isFullyNayStaked,
  ]);

  /*
   * Count it down
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    if (timeLeft === 0) {
      dispatch({
        type: ActionTypes.MOTION_STATE_UPDATE,
        payload: {
          colonyAddress: colony?.colonyAddress,
          motionId: BigNumber.from(motionId),
          userAddress: user?.walletAddress,
        },
      });
    }

    if (timeLeft < 0) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [timeLeft, currentStatePeriod, dispatch, colony, motionId, user]);

  useEffect(() => {
    if (!isStakingPhaseState || isFullyNayStaked) {
      refetchMotionTimeoutPeriods();
    }
  }, [
    isStakingPhaseState,
    refetchMotionTimeoutPeriods,
    state,
    isFullyNayStaked,
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
