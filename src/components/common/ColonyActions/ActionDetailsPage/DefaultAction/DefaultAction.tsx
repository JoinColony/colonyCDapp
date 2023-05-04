import React from 'react';

import DetailsWidget from '~shared/DetailsWidget';
import { MotionTag } from '~shared/Tag';
import { useColonyContext } from '~hooks';
import { ColonyAction } from '~types';
import { MOTION_TAG_MAP, MotionState } from '~utils/colonyMotions';

import DefaultActionContent from './DefaultActionContent';

import styles from './DefaultAction.css';

const displayName = 'common.ColonyActions.DefaultAction';

interface DefaultActionProps {
  actionData: ColonyAction;
}

const DefaultAction = ({ actionData }: DefaultActionProps) => {
  const { colony } = useColonyContext();

  if (!colony) {
    return null;
  }

  const isVotingExtensionEnabled = false;
  const motionStyles = MOTION_TAG_MAP[MotionState.Forced];

  return (
    <div className={styles.main}>
      {/* {isMobile && <ColonyHomeInfo showNavigation isMobile />} */}
      {isVotingExtensionEnabled && <MotionTag motionStyles={motionStyles} />}
      <div className={styles.container}>
        <DefaultActionContent actionData={actionData} colony={colony} />
        <DetailsWidget actionData={actionData} colony={colony} />
      </div>
    </div>
  );
};

DefaultAction.displayName = displayName;

export default DefaultAction;
