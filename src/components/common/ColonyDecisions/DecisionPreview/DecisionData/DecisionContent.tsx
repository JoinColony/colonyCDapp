import React from 'react';
import parse from 'html-react-parser';

import UserAvatar from '~shared/UserAvatar';
import { Heading3 } from '~shared/Heading';
import { userDetailPopoverOptions } from '~shared/DetailsWidget';
import { useAppContext } from '~hooks';

import { getMainClasses } from '~utils/css';
import { Objected as ObjectionTag } from '~shared/Tag';

import styles from './DecisionContent.css';

const displayName = 'common.ColonyDecisions.DecisionPreview.DecisionContent';

interface DecisionContentProps {
  description: string;
  title?: string;
  time?: React.ReactNode;
  isObjection?: boolean;
}

const DecisionContent = ({
  title,
  description,
  time = null,
  isObjection = false,
}: DecisionContentProps) => {
  const { user } = useAppContext();
  return (
    <div className={getMainClasses({}, styles, { isObjection })}>
      <div className={styles.meta}>
        <div className={styles.userinfo}>
          <UserAvatar
            size="s"
            notSet={false}
            user={user}
            address={user?.walletAddress || ''}
            showInfo
            popperOptions={userDetailPopoverOptions}
          />
          <div className={styles.nameAndTime}>
            <span
              className={styles.userName}
            >{`@${user?.profile?.displayName}`}</span>
            {time}
          </div>
        </div>
        {isObjection && <ObjectionTag />}
      </div>
      {title && (
        <Heading3 appearance={{ margin: 'none', theme: 'dark' }} text={title} />
      )}
      <div className={styles.descriptionContainer}>{parse(description)}</div>
    </div>
  );
};

DecisionContent.displayName = displayName;

export default DecisionContent;
