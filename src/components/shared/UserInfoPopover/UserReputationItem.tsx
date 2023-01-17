import React from 'react';
import { defineMessages } from 'react-intl';

import { Icons } from '~constants';
import Icon from '~shared/Icon';
import Numeral from '~shared/Numeral';
import { ZeroValue } from '~utils/reputation';

import styles from './UserInfoPopover.css';

const displayName = `UserInfoPopover.UserReputationItem`;

interface Props {
  domainName: string;
  reputationPercentage: string;
}

const MSG = defineMessages({
  starReputationTitle: {
    id: `${displayName}.starReputationTitle`,
    defaultMessage: `User reputation on {domainName}: {reputation}%`,
  },
});

const UserReputationItem = ({ domainName, reputationPercentage }: Props) => {
  return (
    <li className={styles.domainReputationItem}>
      <p className={styles.domainName}>{domainName}</p>
      <div className={styles.reputationContainer}>
        {reputationPercentage === ZeroValue.NearZero && (
          <div className={styles.reputation}>{reputationPercentage}</div>
        )}
        {reputationPercentage &&
          reputationPercentage !== ZeroValue.NearZero && (
            <Numeral
              className={styles.reputation}
              value={reputationPercentage}
              suffix="%"
            />
          )}
        <Icon
          name={Icons.Star}
          appearance={{ size: 'extraTiny' }}
          className={styles.icon}
          title={MSG.starReputationTitle}
          titleValues={{
            reputation: reputationPercentage,
            domainName,
          }}
        />
      </div>
    </li>
  );
};

UserReputationItem.displayName = displayName;

export default UserReputationItem;
