import React from 'react';
import classNames from 'classnames';
import { Id } from '@colony/colony-js';

import CountDownTimer from '~common/ColonyActions/CountDownTimer';
import { MotionState } from '~utils/colonyMotions';
import { MotionData } from '~types';
import { RefetchMotionState, useAppContext } from '~hooks';

import VotingProgress from './VotingProgress';
import EscalateButton from './EscalateButton';

import styles from './MotionCountdown.css';

const displayName = 'common.ColonyActions.ActionDetailsPage.MotionCountdown';

interface MotionCountdownProps {
  motionState: MotionState;
  refetchMotionState: RefetchMotionState;
  motionData: MotionData;
}

const MotionCountdown = ({
  motionState,
  motionData: { motionDomainId, motionId, motionStakes },
  motionData,
  refetchMotionState,
}: MotionCountdownProps) => {
  const { user } = useAppContext();

  const isMotionFinished =
    motionState === MotionState.Passed ||
    motionState === MotionState.Failed ||
    motionState === MotionState.FailedNotFinalizable;

  const showVotingProgress = motionState === MotionState.Voting;
  const showEscalateButton =
    !!user &&
    motionState === MotionState.Escalation &&
    Number(motionDomainId) !== Id.RootDomain;

  return (
    <div
      className={classNames(styles.countdownContainer, {
        [styles.votingCountdownContainer]: showVotingProgress,
        [styles.escalateContainer]: showEscalateButton,
      })}
    >
      {!isMotionFinished && (
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
