import React from 'react';

import Heading from '~shared/Heading';
import UserAvatar from '~shared/UserAvatar';
import UserMention from '~shared/UserMention';
import { User } from '~types';
import CopyableAddress from '~v5/shared/CopyableAddress';

import styles from './UserInfo.css';

interface Props {
  user: User | any;
}

const displayName = 'UserInfoPopover.UserInfo';

const UserInfo = ({ user }: Props) => {
  const userDisplayName = user.profile?.displayName;

  return (
    <div className={styles.container}>
      <UserAvatar size="s" user={user} />
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
          <CopyableAddress full address={user.walletAddress} />
        </div>
      </div>
    </div>
  );
};

UserInfo.displayName = displayName;

export default UserInfo;
