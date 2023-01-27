import React from 'react';
import parse from 'html-react-parser';

import UserAvatar from '~shared/UserAvatar';
import { Heading3 } from '~shared/Heading';
import { userDetailPopoverOptions } from '~shared/DetailsWidget';

import { useColonyContext } from '~hooks';

import { DecisionDataProps } from './DecisionData';

import styles from './DecisionContent.css';

const displayName = 'common.ColonyDecisions.DecisionPreview.DecisionContent';

type DecisionContentProps = {
  [k in keyof DecisionDataProps]-?: DecisionDataProps[k];
};

const DecisionContent = ({ decision, user }: DecisionContentProps) => {
  const { colony } = useColonyContext();

  if (!colony) {
    return null;
  }

  return (
    <div className={styles.decisionContent}>
      <span className={styles.userinfo}>
        <UserAvatar
          colony={colony}
          size="s"
          notSet={false}
          user={user}
          address={user?.walletAddress || ''}
          showInfo
          popperOptions={userDetailPopoverOptions}
        />
        <span className={styles.userName}>{`@${user?.name}`}</span>
      </span>
      <Heading3
        appearance={{ margin: 'none', theme: 'dark' }}
        text={decision.title}
      />
      <div className={styles.descriptionContainer}>
        {parse(decision.description)}
      </div>
    </div>
  );
};

DecisionContent.displayName = displayName;

export default DecisionContent;
