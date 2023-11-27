import React from 'react';
import { Placement } from '@popperjs/core';

import Address from '~shared/Address';
import UserAvatar from '~shared/UserAvatar';
import { Address as AddressType } from '~types';
import { useUserByAddress } from '~hooks';

import sharedStyles from '../DetailsWidget.css';
import styles from './UserDetail.css';
import { splitWalletAddress } from '~utils/splitWalletAddress';

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
  const { user } = useUserByAddress(walletAddress);
  const userDisplayName = user?.profile?.displayName;

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
        {(userDisplayName || splitWalletAddress(walletAddress)) && (
          <div className={styles.username}>
            {userDisplayName || splitWalletAddress(walletAddress)}
          </div>
        )}
        <Address
          address={walletAddress}
          maskedAddressStyles={sharedStyles.address}
        />
      </div>
    </div>
  );
};

UserDetail.displayName = displayName;

export default UserDetail;
