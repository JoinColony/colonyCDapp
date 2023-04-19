import React from 'react';
import classNames from 'classnames';

import CountDownTimer from '~common/ColonyActions/CountDownTimer';
import { MotionState } from '~utils/colonyMotions';
import { MotionData } from '~types';
import { RefetchMotionState } from '~hooks';

import VotingProgress from './VotingProgress';

import styles from './MotionCountdown.css';

const displayName = 'common.ColonyActions.ActionDetailsPage.MotionCountdown';

// const getMotionStakeData = () => {
//   const totalYAYStaked = 10;
//   const totalNAYStakes = 10;
//   const userStakeYay = 10;
//   const userStakeNay = 10;
//   const requiredStake = 50;
//   return {
//     totalStaked: {
//       YAY: totalYAYStaked.toString(),
//       NAY: totalNAYStakes.toString(),
//     },
//     userStake: {
//       YAY: userStakeYay.toString(),
//       NAY: userStakeNay.toString(),
//     },
//     requiredStake,
//   };
// };

// const getIsFullyNayStaked = () => {
//   const motionStakeData = getMotionStakeData();

//   const requiredStake = BigNumber.from(
//     motionStakeData?.requiredStake || 0,
//   ).toString();

//   const totalNayStake = BigNumber.from(motionStakeData?.totalStaked.NAY || 0);
//   return totalNayStake.gte(requiredStake);
// };

interface MotionCountdownProps {
  motionState: MotionState;
  refetchMotionState: RefetchMotionState;
  motionData: MotionData;
}

const MotionCountdown = ({
  motionState,
  motionData,
  refetchMotionState,
}: MotionCountdownProps) => {
  const isMotionFinished =
    motionState === MotionState.Passed ||
    motionState === MotionState.Failed ||
    motionState === MotionState.FailedNotFinalizable;

  // const showEscalateButton
  //   motionDomain !== Id.RootDomain &&
  //   user?.profile &&
  //   motionState === MotionState.Escalation;

  const showVotingProgress = motionState === MotionState.Voting;

  return (
    <div
      className={classNames(styles.countdownContainer, {
        [styles.votingCountdownContainer]: showVotingProgress,
      })}
    >
      {!isMotionFinished && (
        <CountDownTimer
          motionState={motionState}
          refetchMotionState={refetchMotionState}
          motionId={motionData.motionId}
          motionStakes={motionData.motionStakes}
        />
      )}
      {showVotingProgress && <VotingProgress motionData={motionData} />}
      {/* {showEscalateButton && (
        <EscalateButton motionId={motionId} userAddress={user?.walletAddress} />
      )} */}
    </div>
  );
};

MotionCountdown.displayName = displayName;

export default MotionCountdown;
