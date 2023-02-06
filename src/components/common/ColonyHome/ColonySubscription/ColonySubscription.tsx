import React, { useCallback, useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { SpinnerLoader } from '~shared/Preloaders';
import Button, { ThreeDotsButton } from '~shared/Button';
import MaskedAddress from '~shared/MaskedAddress';
import InvisibleCopyableAddress from '~shared/InvisibleCopyableAddress';

import {
  GetFullColonyByNameDocument,
  useCreateWatchedColoniesMutation,
  useDeleteWatchedColoniesMutation,
} from '~gql';
import { CREATE_USER_ROUTE } from '~routes';
import { useAppContext, useColonyContext } from '~hooks';
import { getWatchedColony } from '~utils/watching';
import { handleNewUser } from '~utils/newUser';

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
  const {
    user,
    updateUser,
    wallet,
    walletConnecting,
    connectWallet,
    userLoading,
  } = useAppContext();
  const navigate = useNavigate();

  const watchedItem = getWatchedColony(colony, user?.watchlist?.items);

  /* Watch (follow) a colony */
  const [watch, { data: watchData, loading: loadingWatch }] =
    useCreateWatchedColoniesMutation({
      variables: {
        input: {
          colonyID: colony?.colonyAddress || '',
          userID: user?.walletAddress || '',
        },
      },
      refetchQueries: [
        {
          query: GetFullColonyByNameDocument,
          variables: { name: colony?.name },
        },
      ],
    });

  /* Unwatch (unfollow) a colony */
  const [unwatch, { data: unwatchData, loading: loadingUnwatch }] =
    useDeleteWatchedColoniesMutation({
      variables: { input: { id: watchedItem?.id || '' } },
      refetchQueries: [
        {
          query: GetFullColonyByNameDocument,
          variables: { name: colony?.name },
        },
      ],
    });

  /* Update user on watch/unwatch */
  useEffect(() => {
    if (updateUser) {
      updateUser(user?.walletAddress);
    }
  }, [user, updateUser, watchData, unwatchData]);

  const handleSubscribe = useCallback(() => {
    if (user) {
      watch();
    } else if (wallet && !user) {
      handleNewUser();
      // TO Do: update to new user modal
      navigate(CREATE_USER_ROUTE, { replace: true });
    } else {
      connectWallet?.();
    }
  }, [watch, user, wallet, navigate, connectWallet]);

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
        {(loadingWatch || loadingUnwatch) && (
          <SpinnerLoader appearance={{ theme: 'primary', size: 'small' }} />
        )}
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
        {!canInteractWithColony && !walletConnecting && !userLoading && (
          <div className={styles.colonyJoin}>
            <Button
              onClick={handleSubscribe}
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
