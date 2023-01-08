import React from 'react';

import MaskedAddress from '~shared/MaskedAddress';
import InvisibleCopyableAddress from '~shared/InvisibleCopyableAddress';
import { Address, Colony } from '~types';
import UserAvatar from '~shared/UserAvatar';
import { useGetCurrentUserQuery } from '~gql';

import styles from './DetailsWidgetUser.css';

const displayName = 'DetailsWidgetUser';

interface Props {
  colony: Colony;
  walletAddress: Address;
}

const DetailsWidgetUser = ({ colony, walletAddress }: Props) => {
  const { data } = useGetCurrentUserQuery({
    variables: {
      address: walletAddress,
    },
  });
  const user = data?.getUserByAddress?.items?.[0];
  const userDisplayName = user?.profile?.displayName;
  const username = user?.name;

  return (
    <div className={styles.main}>
      <UserAvatar
        colony={colony}
        size="s"
        notSet={false}
        user={user || undefined}
        address={walletAddress || ''}
        showInfo
        popperOptions={{
          showArrow: false,
          placement: 'left',
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 10],
              },
            },
          ],
        }}
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

DetailsWidgetUser.displayName = displayName;

export default DetailsWidgetUser;
