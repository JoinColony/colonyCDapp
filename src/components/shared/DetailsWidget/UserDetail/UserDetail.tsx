import React from 'react';
import { Placement } from '@popperjs/core';

import MaskedAddress from '~shared/MaskedAddress';
import InvisibleCopyableAddress from '~shared/InvisibleCopyableAddress';
import UserAvatar from '~shared/UserAvatar';
import { useAppContext } from '~hooks';
import { Address, Colony } from '~types';

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
  colony?: Colony;
  walletAddress: Address;
}

const UserDetail = ({ colony, walletAddress }: Props) => {
  const { user } = useAppContext();
  const userDisplayName = user?.profile?.displayName;
  const username = user?.name;

  return (
    <div className={styles.main}>
      <UserAvatar
        colony={colony}
        size="s"
        notSet={false}
        user={user}
        address={walletAddress || ''}
        showInfo
        popperOptions={userDetailPopoverOptions}
      />
      <div className={styles.textContainer}>
        {(userDisplayName || username) && (
          <div className={styles.username}>
            {userDisplayName || `@${username}`}
          </div>
        )}
        <InvisibleCopyableAddress address={walletAddress}>
          <div className={styles.address}>
            <MaskedAddress address={walletAddress} />
          </div>
        </InvisibleCopyableAddress>
      </div>
    </div>
  );
};

UserDetail.displayName = displayName;

export default UserDetail;
