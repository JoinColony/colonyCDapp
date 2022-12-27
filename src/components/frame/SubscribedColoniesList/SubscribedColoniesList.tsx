import React, { useEffect } from 'react';
import { defineMessages } from 'react-intl';

import Icon from '~shared/Icon';
import { SpinnerLoader } from '~shared/Preloaders';
import NavLink from '~shared/NavLink';
import ColonyAvatar from '~shared/ColonyAvatar';
import { CREATE_COLONY_ROUTE } from '~routes/index';
import { useAppContext, useCanInteractWithNetwork, useMobile } from '~hooks';

import SubscribedColoniesDropdown from './SubscribedColoniesDropdown';

import styles from './SubscribedColoniesList.css';

const displayName = 'frame.SubscribedColoniesList';

const MSG = defineMessages({
  iconTitleCreateNewColony: {
    id: `${displayName}.iconTitleCreateNewColony`,
    defaultMessage: 'Create New Colony',
  },
});

const SubscribedColoniesList = () => {
  const { user, userLoading, updateUser } = useAppContext();
  const canInteractWithNetwork = useCanInteractWithNetwork();
  const isMobile = useMobile();

  /* Ensures colony list is up-to-date post create colony flow. */
  useEffect(() => {
    if (updateUser) {
      updateUser(user?.walletAddress);
    }
  }, [user, updateUser]);

  const { items: watchlist = [] } = user?.watchlist || {};

  const sortByDate = (firstWatchEntry, secondWatchEntry) => {
    const firstWatchTime = new Date(firstWatchEntry?.createdAt || 1).getTime();
    const secondWatchTime = new Date(
      secondWatchEntry?.createdAt || 1,
    ).getTime();
    return firstWatchTime - secondWatchTime;
  };

  return (
    <div className={styles.main}>
      <div className={styles.scrollableContainer}>
        {userLoading && (
          <div className={styles.loadingColonies}>
            <SpinnerLoader appearance={{ size: 'medium' }} />
          </div>
        )}
        {!userLoading && isMobile && (
          <>
            {watchlist.length ? (
              <SubscribedColoniesDropdown
                watchlist={[...watchlist].sort(sortByDate)}
              />
            ) : (
              <div className={styles.item}>
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
            )}
          </>
        )}
        {!userLoading &&
          !isMobile &&
          [...watchlist].sort(sortByDate).map((item) => {
            const { colonyAddress = '', name } = item?.colony || {};
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
                      colony={item?.colony}
                      colonyAddress={colonyAddress}
                      size="s"
                    />
                  </div>
                </NavLink>
              </div>
            );
          })}
      </div>
      {canInteractWithNetwork && !isMobile && (
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
      )}
    </div>
  );
};

SubscribedColoniesList.displayName = displayName;

export default SubscribedColoniesList;
