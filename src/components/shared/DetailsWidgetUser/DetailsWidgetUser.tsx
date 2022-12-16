import React from 'react';
// import { AddressZero } from '@ethersproject/constants';

// import { createAddress } from '~utils/web3';
// import HookedUserAvatar from '~shared/HookedUserAvatar';
import MaskedAddress from '~shared/MaskedAddress';
import InvisibleCopyableAddress from '~shared/InvisibleCopyableAddress';
// import { useUser } from '~data/index';
// import { useColonyContext } from '~hooks';
import { Address } from '~types';

import styles from './DetailsWidgetUser.css';

const displayName = 'DetailsWidgetUser';

interface Props {
  walletAddress: Address;
}

// @NOTE once `useUser` or equvalent is available, this component can be
// refactored to use it
const DetailsWidgetUser = ({ walletAddress }: Props) => {
  // const { colony } = useColonyContext();
  // const UserAvatar = HookedUserAvatar({ fetchUser: false });
  // const userProfile = useUser(createAddress(walletAddress || AddressZero));
  // const userDisplayName = userProfile?.profile?.displayName;
  // const username = userProfile?.profile?.username;

  return (
    <div className={styles.main}>
      {/* <UserAvatar
        colony={colony}
        size="s"
        notSet={false}
        user={userProfile}
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
      /> */}
      <div className={styles.textContainer}>
        {/* {(userDisplayName || username) && (
          <div className={styles.username}>
            {userDisplayName || `@${username}`}
          </div>
        )} */}
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
