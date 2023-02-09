import React from 'react';

import DetailsWidget from '~shared/DetailsWidget';

import { useColonyContext, useEnabledExtensions } from '~hooks';
import { ColonyAction } from '~types';
import { Forced as ForcedTag } from '~shared/Tag';

import DefaultActionContent from './DefaultActionContent';

import styles from './DefaultAction.css';

const displayName = 'common.ColonyActions.DefaultAction';

interface DefaultActionProps {
  actionData: ColonyAction;
}

const DefaultAction = ({ actionData }: DefaultActionProps) => {
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
        <DefaultActionContent actionData={actionData} colony={colony} />
        <DetailsWidget actionData={actionData} colony={colony} />
      </div>
    </div>
  );
};

DefaultAction.displayName = displayName;

export default DefaultAction;
