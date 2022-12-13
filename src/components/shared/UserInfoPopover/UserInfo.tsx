import React from 'react';

import CopyableAddress from '~shared/CopyableAddress';
import Heading from '~shared/Heading';
import UserMention from '~shared/UserMention';
import UserAvatar from '~shared/UserAvatar';

import { User } from '~types';

import styles from './UserInfo.css';

interface Props {
  user: User;
}

const displayName = 'UserInfoPopover.UserInfo';

const UserInfo = ({ user }: Props) => {
  const { displayName: userDisplayName } = user.profile || {};

  return (
    <div className={styles.container}>
      <UserAvatar
        size="s"
        address={user.walletAddress}
        user={user}
        notSet={false}
      />
      <div className={styles.textContainer}>
        {userDisplayName && (
          <Heading
            appearance={{ margin: 'none', size: 'normal', theme: 'dark' }}
            text={userDisplayName}
          />
        )}
        {userDisplayName && (
          /*
           * @NOTE Potential recursion loop here.
           *
           * Never pass `showInfo` to this instance of UserMention, otherwise you'll trigger it
           */
          <p className={styles.userName}>
            <UserMention user={user} hasLink />
          </p>
        )}
        <div className={styles.address}>
          <CopyableAddress full>{user.walletAddress}</CopyableAddress>
        </div>
      </div>
    </div>
  );
};

UserInfo.displayName = displayName;

export default UserInfo;
