import React from 'react';

import { motionTags } from '~shared/Tag';
import { MotionState } from '~utils/colonyMotions';
import { MotionData } from '~types';

import MotionCountdown from '../MotionCountdown';

import styles from './MotionHeading.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.MotionHeading';

interface MotionHeadingProps {
  motionState: MotionState;
  motionData: MotionData;
}

const MotionHeading = ({ motionState, motionData }: MotionHeadingProps) => {
  const MotionTag = motionTags[motionState];

  return (
    <div className={styles.main}>
      <MotionTag />
      <MotionCountdown motionState={motionState} motionData={motionData} />
    </div>
  );
};

MotionHeading.displayName = displayName;

export default MotionHeading;
