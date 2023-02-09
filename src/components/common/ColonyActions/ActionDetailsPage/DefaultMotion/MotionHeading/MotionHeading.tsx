import React from 'react';

import { motionTags } from '~shared/Tag';
import { MotionState } from '~utils/colonyMotions';

import StakeRequiredBanner from '../StakeRequiredBanner';
import MotionCountdown from '../MotionCountdown';

import styles from './MotionHeading.css';

const displayName =
  'common.ColonyActions.ActionsPage.DefaultMotion.MotionHeading';

interface MotionHeadingProps {
  motionState: MotionState;
}

const MotionHeading = ({ motionState }: MotionHeadingProps) => {
  const MotionTag = motionTags[motionState];
  const showBanner = true; // !shouldDisplayMotionInActionsList(currentStake, requiredStake);
  const isDecision = false;

  return (
    <div className={styles.main}>
      {showBanner && <StakeRequiredBanner isDecision={isDecision} />}
      <MotionTag />
      <MotionCountdown motionState={motionState} />
    </div>
  );
};

MotionHeading.displayName = displayName;

export default MotionHeading;
