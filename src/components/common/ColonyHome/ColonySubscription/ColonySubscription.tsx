import React, { useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { CREATE_USER_ROUTE } from '~routes/index';
import { SpinnerLoader } from '~shared/Preloaders';
import Button, { ThreeDotsButton } from '~shared/Button';
import Link from '~shared/Link';
import MaskedAddress from '~shared/MaskedAddress';
import InvisibleCopyableAddress from '~shared/InvisibleCopyableAddress';

import {
  useCreateWatchedColoniesMutation,
  useDeleteWatchedColoniesMutation,
} from '~gql';
import { Colony } from '~types';
import { useAppContext, useColonyContext } from '~hooks';

import ColonySubscriptionInfoPopover from './ColonySubscriptionInfoPopover';

import styles from './ColonySubscription.css';

const displayName = 'common.ColonyHome.ColonySubscription';

const MSG = defineMessages({
  copyMessage: {
    id: `${displayName}.copyMessage`,
    defaultMessage: 'Click to copy colony address',
  },
  joinColony: {
    id: `${displayName}.joinColony`,
    defaultMessage: 'Join this colony',
  },
  colonyMenuTitle: {
    id: `${displayName}.colonyMenuTitle`,
    defaultMessage: 'Colony Menu',
  },
});

const ColonySubscription = () => {
  const { colony, canInteractWithColony } = useColonyContext();
  const { user, updateUser, walletConnecting } = useAppContext();

  const watchedItem = (user?.watchlist?.items || []).find(
    (item) => (item?.colony as Colony)?.colonyAddress === colony?.colonyAddress,
  );

  /* Watch (follow) a colony */
  const [watched, { data: watchState, loading: loadingWatched }] =
    useCreateWatchedColoniesMutation({
      variables: {
        input: {
          colonyID: colony?.colonyAddress || '',
          userID: user?.walletAddress || '',
        },
      },
    });

  /* Unwatch (unfollow) a colony */
  const [unwatch, { data: unWatchState, loading: loadingUnwatch }] =
    useDeleteWatchedColoniesMutation({
      variables: { input: { id: watchedItem?.id || '' } },
    });

  /* Update user on watch/unwatch */
  useEffect(() => {
    if (updateUser) {
      updateUser(user?.walletAddress);
    }
  }, [user, updateUser, watchState, unWatchState]);

  return (
    <div className={styles.main}>
      <div className={canInteractWithColony ? styles.colonySubscribed : ''}>
        {colony?.colonyAddress && (
          <InvisibleCopyableAddress
            address={colony?.colonyAddress}
            copyMessage={MSG.copyMessage}
          >
            <div className={styles.colonyAddress}>
              <MaskedAddress address={colony?.colonyAddress} />
            </div>
          </InvisibleCopyableAddress>
        )}
        {loadingWatched ||
          (loadingUnwatch && (
            <SpinnerLoader appearance={{ theme: 'primary', size: 'small' }} />
          ))}
        {canInteractWithColony && !loadingWatched && !loadingUnwatch && (
          <ColonySubscriptionInfoPopover
            onUnsubscribe={() => unwatch()}
            canUnsubscribe
            // loadingWatched
            // loadingUnwatch
          >
            {({ isOpen, toggle, ref, id }) => (
              <ThreeDotsButton
                id={id}
                innerRef={ref}
                isOpen={isOpen}
                className={styles.menuIconContainer}
                activeStyles={styles.menuActive}
                onClick={toggle}
                tabIndex={0}
                data-test="colonyMenuPopover"
                title={MSG.colonyMenuTitle}
              />
            )}
          </ColonySubscriptionInfoPopover>
        )}
        {!canInteractWithColony && !walletConnecting && (
          <div className={styles.colonyJoin}>
            {user?.name && (
              <Button
                onClick={() => watched()}
                appearance={{ theme: 'blue', size: 'small' }}
                data-test="joinColonyButton"
                className={styles.colonyJoinBtn}
              >
                <FormattedMessage {...MSG.joinColony} />
              </Button>
            )}
            {!user?.name && (
              <Link
                className={styles.colonyJoinBtn}
                to={{ pathname: CREATE_USER_ROUTE }}
                state={{ colonyURL: `/colony/${colony?.name}` }}
                text={MSG.joinColony}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

ColonySubscription.displayName = displayName;

export default ColonySubscription;
