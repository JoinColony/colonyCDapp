import { Id } from '@colony/colony-js';
import classNames from 'classnames';
import React from 'react';

import CountDownTimer from '~common/ColonyActions/CountDownTimer';
import { useAppContext, useShouldDisplayMotionCountdownTime } from '~hooks';
import { ColonyMotion } from '~types';
import { MotionState } from '~utils/colonyMotions';

import { RefetchMotionState } from '../../useGetColonyAction';

import EscalateButton from './EscalateButton';
import VotingProgress from './VotingProgress';

import styles from './MotionCountdown.css';

const displayName = 'common.ColonyActions.ActionDetailsPage.MotionCountdown';

interface MotionCountdownProps {
  motionState: MotionState;
  refetchMotionState: RefetchMotionState;
  motionData: ColonyMotion;
}

const MotionCountdown = ({
  motionState,
  motionData: { nativeMotionDomainId, motionId, motionStakes },
  motionData,
  refetchMotionState,
}: MotionCountdownProps) => {
  const { user } = useAppContext();

  const showMotionCountdownTimer =
    useShouldDisplayMotionCountdownTime(motionState);

  const showVotingProgress = motionState === MotionState.Voting;
  const showEscalateButton =
    !!user &&
    motionState === MotionState.Escalated &&
    Number(nativeMotionDomainId) !== Id.RootDomain;

  return (
    <div
      className={classNames(styles.countdownContainer, {
        [styles.votingCountdownContainer]: showVotingProgress,
        [styles.escalateContainer]: showEscalateButton,
      })}
    >
      {showMotionCountdownTimer && (
        <CountDownTimer
          motionState={motionState}
          refetchMotionState={refetchMotionState}
          motionId={motionId}
          motionStakes={motionStakes}
        />
      )}
      {showVotingProgress && <VotingProgress motionData={motionData} />}
      {showEscalateButton && <EscalateButton motionId={motionId} />}
    </div>
  );
};

MotionCountdown.displayName = displayName;

export default MotionCountdown;
