import React from 'react';

import { mockEventData } from '~common/ColonyActions/mockData';
import DetailsWidget from '~shared/DetailsWidget';

import { useColonyContext, useEnabledExtensions } from '~hooks';
import { ColonyAction } from '~types';
import { Forced as ForcedTag } from '~shared/Tag';

import DefaultActionContent from './DefaultActionContent';

import styles from './DefaultAction.css';

const displayName = 'common.ColonyActions.DefaultAction';

interface DefaultActionProps {
  item: ColonyAction;
}

const DefaultAction = ({ item }: DefaultActionProps) => {
  const { colony } = useColonyContext();

  const {
    enabledExtensions: { isVotingReputationEnabled },
  } = useEnabledExtensions();

  if (!colony) {
    return null;
  }

  return (
    <div className={styles.main}>
      {/* {isMobile && <ColonyHomeInfo showNavigation isMobile />} */}
      {isVotingReputationEnabled && <ForcedTag />}
      <div className={styles.container}>
        <DefaultActionContent item={item} colony={colony} />
        <DetailsWidget values={{ ...mockEventData, ...item }} colony={colony} />
      </div>
    </div>
  );
};

DefaultAction.displayName = displayName;

export default DefaultAction;
