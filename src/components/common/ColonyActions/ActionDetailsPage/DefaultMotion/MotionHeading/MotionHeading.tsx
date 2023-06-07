import React from 'react';

import { motionTags } from '~shared/Tag';
import { MotionState } from '~utils/colonyMotions';
import { ColonyMotion } from '~types';

import { RefetchMotionState } from '../../useGetColonyAction';
import MotionCountdown from '../MotionCountdown';

import styles from './MotionHeading.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.MotionHeading';

interface MotionHeadingProps {
  motionState: MotionState;
  refetchMotionState: RefetchMotionState;
  motionData: ColonyMotion;
}

const MotionHeading = ({
  motionState,
  motionData,
  refetchMotionState,
}: MotionHeadingProps) => {
  const MotionTag = motionTags[motionState];

  return (
    <div className={styles.main}>
      <MotionTag />
      <MotionCountdown
        motionState={motionState}
        refetchMotionState={refetchMotionState}
        motionData={motionData}
      />
    </div>
  );
};

MotionHeading.displayName = displayName;

export default MotionHeading;
