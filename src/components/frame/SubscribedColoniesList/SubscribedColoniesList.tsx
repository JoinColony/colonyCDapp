import React from 'react';
import { defineMessages } from 'react-intl';
import { useQuery, gql } from '@apollo/client';

import Icon from '~shared/Icon';
import { SpinnerLoader } from '~shared/Preloaders';
import NavLink from '~shared/NavLink';
import ColonyAvatar from '~shared/ColonyAvatar';

// import { useLoggedInUser, useUserColoniesQuery } from '~data/index';
import { CREATE_COLONY_ROUTE } from '~routes/index';
// import { checkIfNetworkIsAllowed } from '~utils/networks';
import { useAppContext } from '~hooks';
import { getWatchlist } from '~gql';

import styles from './SubscribedColoniesList.css';

const displayName = 'root.SubscribedColoniesList';

const MSG = defineMessages({
  iconTitleCreateNewColony: {
    id: `${displayName}.iconTitleCreateNewColony`,
    defaultMessage: 'Create New Colony',
  },
});

const SubscribedColoniesList = () => {
  const { wallet } = useAppContext();

  const { data, loading } = useQuery(gql(getWatchlist), {
    variables: {
      address: wallet?.address,
    },
  });

  const { items: watchlist = [] } = data?.listWatchedColonies || {};

  const sortByDate = (firstWatchEntry, secondWatchEntry) => {
    const firstWatchTime = new Date(firstWatchEntry?.createdAt || 1).getTime();
    const secondWatchTime = new Date(
      secondWatchEntry?.createdAt || 1,
    ).getTime();
    return firstWatchTime - secondWatchTime;
  };

  // const watchlist: Array<{ colony: Colony }> =
  //   data?.listWatchedColonies?.items[0]?.watchlist?.items || [];

  // const { walletAddress, networkId, ethereal } = useLoggedInUser();
  // const { data, loading } = useUserColoniesQuery({
  //   variables: { address: walletAddress },
  // });

  // const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);

  return (
    <div className={styles.main}>
      <div className={styles.scrollableContainer}>
        {loading && (
          <div className={styles.loadingColonies}>
            <SpinnerLoader appearance={{ size: 'medium' }} />
          </div>
        )}
        {!loading &&
          // data?.user?.processedColonies.map((colony) => {
          [...watchlist].sort(sortByDate).map(({ colony }) => {
            const { colonyAddress, name } = colony;
            return (
              <div className={styles.item} key={colonyAddress}>
                <NavLink
                  activeClassName={styles.activeColony}
                  className={styles.itemLink}
                  title={name}
                  to={`/colony/${name}`}
                >
                  <div className={styles.itemImage}>
                    <ColonyAvatar
                      colony={colony}
                      colonyAddress={colonyAddress}
                      size="s"
                    />
                  </div>
                </NavLink>
              </div>
            );
          })}
      </div>
      {/* {(ethereal || isNetworkAllowed) && ( */}
      <div className={`${styles.item} ${styles.newColonyItem}`}>
        <NavLink
          className={styles.itemLink}
          to={CREATE_COLONY_ROUTE}
          data-test="createColony"
        >
          <Icon
            className={styles.newColonyIcon}
            name="circle-plus"
            title={MSG.iconTitleCreateNewColony}
          />
        </NavLink>
      </div>
      {/* )} */}
    </div>
  );
};

SubscribedColoniesList.displayName = displayName;

export default SubscribedColoniesList;
