import React from 'react';
import parse from 'html-react-parser';

import UserAvatar from '~shared/UserAvatar';
import { Heading3 } from '~shared/Heading';
import { userDetailPopoverOptions } from '~shared/DetailsWidget';
import { DecisionDraft } from '~utils/decisions';
import { useAppContext } from '~hooks';

import styles from './DecisionContent.css';
import { ColonyDecision } from '~types';

const displayName = 'common.ColonyDecisions.DecisionPreview.DecisionContent';

interface DecisionContentProps {
  decisionData: DecisionDraft | ColonyDecision;
  time?: React.ReactNode;
}

const DecisionContent = ({
  decisionData,
  time = null,
}: DecisionContentProps) => {
  const { user } = useAppContext();
  return (
    <div className={styles.decisionContent}>
      <span className={styles.userinfo}>
        <UserAvatar
          size="s"
          notSet={false}
          user={user}
          address={user?.walletAddress || ''}
          showInfo
          popperOptions={userDetailPopoverOptions}
        />
        <div className={styles.nameAndTime}>
          <span className={styles.userName}>{`@${user?.name}`}</span>
          {time}
        </div>
      </span>
      <Heading3
        appearance={{ margin: 'none', theme: 'dark' }}
        text={decisionData.title}
      />
      <div className={styles.descriptionContainer}>
        {parse(decisionData.description)}
      </div>
    </div>
  );
};

DecisionContent.displayName = displayName;

export default DecisionContent;
