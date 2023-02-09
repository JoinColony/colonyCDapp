import React from 'react';

import { motionTags } from '~shared/Tag';
import { MotionState } from '~utils/colonyMotions';

import MotionCountdown from '../MotionCountdown';

import styles from './MotionHeading.css';

const displayName =
  'common.ColonyActions.ActionsPage.DefaultMotion.MotionHeading';

interface MotionHeadingProps {
  motionState: MotionState;
}

const MotionHeading = ({ motionState }: MotionHeadingProps) => {
  const MotionTag = motionTags[motionState];

  return (
    <div className={styles.main}>
      <MotionTag />
      <MotionCountdown motionState={motionState} />
    </div>
  );
};

MotionHeading.displayName = displayName;

export default MotionHeading;
