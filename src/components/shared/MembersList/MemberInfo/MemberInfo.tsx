import React from 'react';
import { defineMessages } from 'react-intl';

import UserMention from '~shared/UserMention';
import InvisibleCopyableAddress from '~shared/InvisibleCopyableAddress';
import MaskedAddress from '~shared/MaskedAddress';
import IconTooltip from '~shared/IconTooltip';

import { User } from '~types';

import styles from './MemberInfo.css';

const componentDisplayName = 'MembersList.MembersListItem';

interface Props {
  isWhitelisted: boolean;
  user?: User | null;
}

const MSG = defineMessages({
  whitelistedTooltip: {
    id: `${componentDisplayName}.whitelistedTooltip`,
    defaultMessage: `Added to address book`,
  },
});

const MemberInfo = ({ isWhitelisted, user }: Props) => {
  const { profile, name, walletAddress } = user || {};
  const { displayName } = profile || {};

  return (
    <div className={styles.usernameSection}>
      {displayName && (
        <span className={styles.displayName} title={displayName}>
          {displayName}
        </span>
      )}
      {name && (
        <span className={styles.username}>
          <UserMention hasLink={false} username={name} />
        </span>
      )}
      <div className={styles.address}>
        <InvisibleCopyableAddress address={walletAddress || ''}>
          <MaskedAddress address={walletAddress || ''} />
        </InvisibleCopyableAddress>
        {isWhitelisted && (
          <IconTooltip
            icon="check-mark"
            tooltipText={MSG.whitelistedTooltip}
            tooltipClassName={styles.whitelistedIconTooltip}
            appearance={{ size: 'medium' }}
            className={styles.whitelistedIcon}
          />
        )}
      </div>
    </div>
  );
};

MemberInfo.displayName = componentDisplayName;

export default MemberInfo;
