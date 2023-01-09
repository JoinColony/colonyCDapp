import React, { useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { SpinnerLoader } from '~shared/Preloaders';
import Button, { ThreeDotsButton } from '~shared/Button';
import MaskedAddress from '~shared/MaskedAddress';
import InvisibleCopyableAddress from '~shared/InvisibleCopyableAddress';

import {
  useCreateWatchedColoniesMutation,
  useDeleteWatchedColoniesMutation,
} from '~gql';
import { useAppContext, useColonyContext } from '~hooks';
import { watchingColony } from '~utils/watching';

import ColonySubscriptionInfoPopover from './ColonySubscriptionInfoPopover';

import styles from './ColonySubscription.css';

const displayName = 'common.ColonyHome.ColonySubscription';

const MSG = defineMessages({
  copyMessage: {
    id: `${displayName}.copyMessage`,
    defaultMessage: 'Click to copy Colony address',
  },
  joinColony: {
    id: `${displayName}.joinColony`,
    defaultMessage: 'Join this Colony',
  },
  colonyMenuTitle: {
    id: `${displayName}.colonyMenuTitle`,
    defaultMessage: 'Colony Menu',
  },
});

const ColonySubscription = () => {
  const { colony, canInteractWithColony } = useColonyContext();
  const { user, updateUser, walletConnecting, connectWallet } = useAppContext();

  const watchedItem = watchingColony(colony, user);

  /* Watch (follow) a colony */
  const [watch, { data: watchState, loading: loadingWatch }] =
    useCreateWatchedColoniesMutation({
      variables: {
        input: {
          colonyID: colony?.colonyAddress || '',
          userID: user?.walletAddress || '',
        },
      },
    });

  /* Unwatch (unfollow) a colony */
  const [unwatch, { data: unwatchState, loading: loadingUnwatch }] =
    useDeleteWatchedColoniesMutation({
      variables: { input: { id: watchedItem?.id || '' } },
    });

  /* Update user on watch/unwatch */
  useEffect(() => {
    if (updateUser) {
      updateUser(user?.walletAddress);
    }
  }, [user, updateUser, watchState, unwatchState]);

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
        {loadingWatch ||
          (loadingUnwatch && (
            <SpinnerLoader appearance={{ theme: 'primary', size: 'small' }} />
          ))}
        {canInteractWithColony && !loadingWatch && !loadingUnwatch && (
          <ColonySubscriptionInfoPopover onUnsubscribe={unwatch} canUnsubscribe>
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
            <Button
              onClick={() =>
                user ? watch() : connectWallet && connectWallet()
              }
              appearance={{ theme: 'blue', size: 'small' }}
              data-test="joinColonyButton"
              className={styles.colonyJoinBtn}
            >
              <FormattedMessage {...MSG.joinColony} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

ColonySubscription.displayName = displayName;

export default ColonySubscription;
