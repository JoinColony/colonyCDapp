import React from 'react';
import classNames from 'classnames';
import { Id } from '@colony/colony-js';

import CountDownTimer from '~common/ColonyActions/CountDownTimer';
import {
  MotionState,
  useShouldDisplayMotionCountdownTime,
} from '~utils/colonyMotions';
import { MotionData } from '~types';
import { useAppContext } from '~hooks';

import { RefetchMotionState } from '../../useGetColonyAction';
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

  const showMotionCountdownTimer =
    useShouldDisplayMotionCountdownTime(motionState);

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
