import React from 'react';

import CopyableAddress from '~shared/CopyableAddress';
import Heading from '~shared/Heading';
import UserMention from '~shared/UserMention';
import UserAvatar from '~shared/UserAvatar';
import { User } from '~types';

import styles from './InfoPopover.css';

interface Props {
  user: User;
}

const displayName = 'InfoPopover.UserInfo';

const UserInfo = ({ user }: Props) => {
  const { walletAddress, profile } = user;
  const { displayName: userDisplayName } = profile || {};
  return (
    <div className={styles.container}>
      <UserAvatar
        size="s"
        address={walletAddress}
        user={user}
        notSet={false}
        avatarURL={user.profile?.avatar ?? ''}
      />
      <div className={styles.textContainer}>
        {userDisplayName && (
          <Heading
            appearance={{ margin: 'none', size: 'normal', theme: 'dark' }}
            text={userDisplayName}
          />
        )}
        {/* @NOTE Potential recurrsion loop here. * * Never pass `showInfo` to
          this instance of UserMention, otherwise you'll trigger it */}
        <p className={styles.userName}>
          <UserMention username={user.name} hasLink />
        </p>
        <div className={styles.address}>
          <CopyableAddress full>{walletAddress}</CopyableAddress>
        </div>
      </div>
    </div>
  );
};

UserInfo.displayName = displayName;

export default UserInfo;
