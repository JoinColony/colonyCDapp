import React from 'react';
import { Placement } from '@popperjs/core';

import Address from '~shared/Address';
import UserAvatar from '~shared/UserAvatar';
import { useAppContext } from '~hooks';
import { Address as AddressType } from '~types';

import styles from './UserDetail.css';

const displayName = 'DetailsWidget.UserDetail';

export const userDetailPopoverOptions = {
  showArrow: false,
  placement: 'left' as Placement,
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 10],
      },
    },
  ],
};

interface Props {
  walletAddress: AddressType;
}

const UserDetail = ({ walletAddress }: Props) => {
  const { user } = useAppContext();
  const userDisplayName = user?.profile?.displayName;
  const username = user?.name;

  return (
    <div className={styles.main}>
      <UserAvatar
        size="s"
        notSet={false}
        user={user}
        showInfo
        popperOptions={userDetailPopoverOptions}
      />
      <div className={styles.textContainer}>
        {(userDisplayName || username) && (
          <div className={styles.username}>
            {userDisplayName || `@${username}`}
          </div>
        )}
        <Address address={walletAddress} maskedAddressStyles={styles.address} />
      </div>
    </div>
  );
};

UserDetail.displayName = displayName;

export default UserDetail;
