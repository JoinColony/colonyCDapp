import React from 'react';

import { mockEventData } from '~common/ColonyActions/mockData';
import DetailsWidget from '~shared/DetailsWidget';
import { MotionTag } from '~shared/Tag';

import { useColonyContext } from '~hooks';
import { ColonyAction } from '~types';
import { MotionState, MOTION_TAG_MAP } from '~utils/colonyMotions';

import DefaultActionContent from './DefaultActionContent';

import styles from './DefaultAction.css';

const displayName = 'common.ColonyActions.DefaultAction';

interface DefaultActionProps {
  item: ColonyAction;
}

const DefaultAction = ({ item }: DefaultActionProps) => {
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
        <DefaultActionContent item={item} colony={colony} />
        <DetailsWidget values={{ ...mockEventData, ...item }} colony={colony} />
      </div>
    </div>
  );
};

DefaultAction.displayName = displayName;

export default DefaultAction;
