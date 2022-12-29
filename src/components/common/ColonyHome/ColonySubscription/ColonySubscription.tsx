import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import {
  useCreateWatchedColoniesMutation,
  useDeleteWatchedColoniesMutation,
} from '~gql';
import { Colony } from '~types';
import { useAppContext, useColonyContext } from '~hooks';
import { CREATE_USER_ROUTE } from '~routes/index';
import { SpinnerLoader } from '~shared/Preloaders';
import Button, { ThreeDotsButton } from '~shared/Button';
import Link from '~shared/Link';
import Address from '~shared/Address';

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
  const { colony } = useColonyContext();
  const { colonyAddress } = colony || {};

  const { user } = useAppContext();

  const isWatching = (user?.watchlist?.items || []).find(
    (item) => (item?.colony as Colony)?.colonyAddress === colonyAddress,
  );

  const [watched, { loading: loadingWatched }] =
    useCreateWatchedColoniesMutation({
      variables: {
        input: {
          colonyID: colonyAddress || '',
          userID: user?.walletAddress || '',
        },
      },
    });

  const [unwatch, { loading: loadingUnwatch }] =
    useDeleteWatchedColoniesMutation({
      variables: { input: { id: isWatching?.id || '' } },
    });

  return (
    <div className={styles.main}>
      {loadingWatched ||
        (loadingUnwatch && (
          <div className={styles.spinnerContainer}>
            <SpinnerLoader appearance={{ theme: 'primary', size: 'small' }} />
          </div>
        ))}
      <div className={isWatching ? styles.colonySubscribed : ''}>
        {colonyAddress && (
          <Address
            address={colonyAddress}
            maskedAddressStyles={styles.colonyAddress}
            copyMessage={MSG.copyMessage}
          />
        )}
        {isWatching && (
          <ColonySubscriptionInfoPopover
            onUnsubscribe={() => unwatch()}
            canUnsubscribe
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
        {!isWatching && (
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
