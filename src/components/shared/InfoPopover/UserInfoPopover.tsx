import React from 'react';

import { User } from '~types';

import UserInfo from './UserInfo';
import NotAvailableMessage from './NotAvailableMessage';

import styles from './InfoPopover.css';

interface Props {
  user?: User;
  userNotAvailable?: boolean;
}

const displayName = 'InfoPopover.UserInfoPopover';

const UserInfoPopover = ({ user, userNotAvailable = false }: Props) => (
  <div className={styles.main}>
    <div className={styles.section}>
      {!userNotAvailable && user ? (
        <UserInfo user={user} />
      ) : (
        <NotAvailableMessage notAvailableDataName="User" />
      )}
    </div>
  </div>
);

UserInfoPopover.displayName = displayName;

export default UserInfoPopover;
