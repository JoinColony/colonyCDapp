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

const UserInfo = ({ user: { walletAddress, name, profile }, user }: Props) => {
  /*
   * @NOTE We have to fetch our avatar base64 data from IPFS because if we
   * use the "normal" HookedUserAvar we cause a circular call which will
   * exceed the call stack (obviously) and break React
   */
  return (
    <div className={styles.container}>
      <UserAvatar size="s" address={walletAddress} user={user} />
      <div className={styles.textContainer}>
        {profile?.displayName && (
          <Heading
            appearance={{ margin: 'none', size: 'normal', theme: 'dark' }}
            text={profile?.displayName}
          />
        )}
        {name && (
          /*
           * @NOTE Potential recurrsion loop here.
           *
           * Never pass `showInfo` to this instance of UserMention, otherwise you'll trigger it
           */
          <p className={styles.userName}>
            <UserMention user={user} hasLink />
          </p>
        )}
        <div className={styles.address}>
          <CopyableAddress full>{walletAddress}</CopyableAddress>
        </div>
      </div>
    </div>
  );
};

UserInfo.displayName = displayName;

export default UserInfo;
