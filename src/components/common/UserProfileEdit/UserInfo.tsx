import React from 'react';
import { defineMessages } from 'react-intl';

import CopyableAddress from '~shared/CopyableAddress';
import { InputLabel } from '~shared/Fields';
import { Heading3 } from '~shared/Heading';
import UserMention from '~shared/UserMention';
import { User } from '~types';

import styles from './UserMainSettings.css';

const displayName = 'common.UserProfileEdit.UserInfo';

const MSG = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Profile',
  },
  labelWallet: {
    id: `${displayName}.labelWallet`,
    defaultMessage: 'Your Wallet',
  },
  labelUsername: {
    id: `${displayName}.labelUsername`,
    defaultMessage: 'Unique Username',
  },
});

interface UserInfoProps {
  user: User;
}

const UserInfo = ({ user: { walletAddress }, user }: UserInfoProps) => {
  return (
    <>
      <Heading3 appearance={{ theme: 'dark' }} text={MSG.heading} />
      <InputLabel label={MSG.labelWallet} />
      <CopyableAddress appearance={{ theme: 'big' }} full>
        {walletAddress}
      </CopyableAddress>
      <div className={styles.usernameContainer}>
        <InputLabel label={MSG.labelUsername} />
        <UserMention user={user} title={user.name || walletAddress} hasLink={false} data-test="userProfileUsername" />
      </div>
    </>
  );
};

UserInfo.displayName = displayName;

export default UserInfo;
