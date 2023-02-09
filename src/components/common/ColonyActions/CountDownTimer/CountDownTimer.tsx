import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
// import { useDispatch } from 'react-redux';

// import { splitTimeLeft } from '~utils/time';
import { MotionState } from '~utils/colonyMotions';
// import { MiniSpinnerLoader } from '~shared/Preloaders';
// import TimerValue from '~shared/TimerValue';
// import { useAppContext, useColonyContext } from '~hooks';

import styles from './CountDownTimer.css';

const displayName = 'common.ColonyActions.CountDownTimer';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: `{motionState, select,
        Staking {Time left to stake}
        Staked {Motion will pass in}
        Objection {Motion will fail in}
        Voting {Voting ends in}
        Reveal {Reveal ends in}
        Escalation {Time left to escalate}
        other {Timeout}
      }`,
  },
  days: {
    id: `${displayName}.days`,
    defaultMessage: ' {days}d',
  },
  hours: {
    id: `${displayName}.hours`,
    defaultMessage: ' {hours}h',
  },
  minutes: {
    id: `${displayName}.minutes`,
    defaultMessage: ' {minutes}m',
  },
  seconds: {
    id: `${displayName}.seconds`,
    defaultMessage: ' {seconds}s',
  },
  loadingText: {
    id: `${displayName}.loadingText`,
    defaultMessage: 'Loading countdown period',
  },
});

interface Props {
  state: MotionState;
  motionId: number;
  isFullyNayStaked?: boolean;
}

const CountDownTimer = ({
  state,
}: // motionId,
// isFullyNayStaked = false,
Props) => {
  // const { colony } = useColonyContext();
  // const { user } = useAppContext();
  // const dispatch = useDispatch();

  //   const { data, loading, refetch } = useMotionTimeoutPeriodsQuery({
  //     variables: {
  //       colonyAddress,
  //       motionId,
  //     },
  //     notifyOnNetworkStatusChange: true,
  //   });

  //   const currentStatePeriod = useCallback(() => {
  //     switch (state) {
  //       case MotionState.Staking:
  //       case MotionState.Staked:
  //       case MotionState.Objection:
  //         return data?.motionTimeoutPeriods.timeLeftToStake || -1;
  //       case MotionState.Voting:
  //         return data?.motionTimeoutPeriods.timeLeftToSubmit || -1;
  //       case MotionState.Reveal:
  //         return data?.motionTimeoutPeriods.timeLeftToReveal || -1;
  //       case MotionState.Escalation:
  //         return data?.motionTimeoutPeriods.timeLeftToEscalate || -1;
  //       default:
  //         return -1;
  //     }
  //   }, [data, state]);

  // const [timeLeft, setTimeLeft] = useState<number>(-1);

  // const prevStateRef: MutableRefObject<MotionState | null> = useRef(null);
  // const isStakingPhaseState =
  //   state === MotionState.Staking ||
  //   state === MotionState.Staked ||
  //   state === MotionState.Objection;
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
  //   useEffect(() => {
  //     if (
  //       data &&
  //       state &&
  //       ((prevStateRef.current === null && isStakingPhaseState) ||
  //         !isStakingPhaseState ||
  //         (isStakingPhaseState && isFullyNayStaked))
  //     ) {
  //       const period = currentStatePeriod() / 1000;
  //       setTimeLeft(period > 0 ? period + 5 : period);
  //       prevStateRef.current = state;
  //     }
  //   }, [
  //     data,
  //     currentStatePeriod,
  //     prevStateRef,
  //     state,
  //     isStakingPhaseState,
  //     isFullyNayStaked,
  //   ]);

  /*
   * Count it down
   */
  //   useEffect(() => {
  //     const timer = setInterval(() => {
  //       setTimeLeft(timeLeft - 1);
  //     }, 1000);
  //     if (timeLeft === 0) {
  //       dispatch({
  //         type: ActionTypes.MOTION_STATE_UPDATE,
  //         payload: {
  //           colonyAddress,
  //           motionId: BigNumber.from(motionId),
  //           userAddress: user?.walletAddress,
  //         },
  //       });
  //     }
  //     if (timeLeft < 0) {
  //       clearInterval(timer);
  //     }
  //     return () => clearInterval(timer);
  //   }, [
  //     timeLeft,
  //     currentStatePeriod,
  //     dispatch,
  //     colonyAddress,
  //     motionId,
  //     walletAddress,
  //   ]);

  //   useEffect(() => {
  //     if ((data && !isStakingPhaseState) || (data && isFullyNayStaked)) {
  //       refetch();
  //     }
  //   }, [isStakingPhaseState, data, refetch, state, isFullyNayStaked]);

  /*
   * Split the time into h/m/s for display purpouses
   */
  // const splitTime = splitTimeLeft(timeLeft);

  // if (/*loading || !data*/ false) {
  //   return (
  //     <MiniSpinnerLoader
  //       loadingText={MSG.loadingText}
  //       className={styles.loader}
  //     />
  //   );
  // }

  return (
    <div className={styles.container} data-test="countDownTimer">
      <FormattedMessage {...MSG.title} values={{ motionState: state }} />
      {/* <span className={styles.time}>
        <TimerValue splitTime={splitTime} />
      </span> */}
    </div>
  );
};

CountDownTimer.displayName = displayName;

export default CountDownTimer;
