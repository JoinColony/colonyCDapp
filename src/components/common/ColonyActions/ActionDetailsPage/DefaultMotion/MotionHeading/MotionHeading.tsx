import React from 'react';

import { motionTags } from '~shared/Tag';
import { MotionState } from '~utils/colonyMotions';
import { MotionData } from '~types';
import { RefetchMotionState, useEnabledExtensions } from '~hooks';

import MotionCountdown from '../MotionCountdown';

import styles from './MotionHeading.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.MotionHeading';

interface MotionHeadingProps {
  motionState: MotionState;
  refetchMotionState: RefetchMotionState;
  motionData: MotionData;
}

const MotionHeading = ({
  motionState,
  motionData: { createdBy },
  motionData,
  refetchMotionState,
}: MotionHeadingProps) => {
  const MotionTag = motionTags[motionState];
  const { votingReputationAddress } = useEnabledExtensions();
  /* Do not show a widget if the voting repuation extn that created the motion is no longer installed. */
  const motionIsCurrent = createdBy === votingReputationAddress;

  return (
    <div className={styles.main}>
      <MotionTag />
      {motionIsCurrent && (
        <MotionCountdown
          motionState={motionState}
          refetchMotionState={refetchMotionState}
          motionData={motionData}
        />
      )}
    </div>
  );
};

MotionHeading.displayName = displayName;

export default MotionHeading;
