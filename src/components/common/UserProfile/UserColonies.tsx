import React from 'react';
import { defineMessages } from 'react-intl';

import ColonyGrid from '~common/ColonyGrid';
import Link from '~shared/Link';

import { CREATE_COLONY_ROUTE } from '~routes/index';
import { User } from '~types';
import { useAppContext } from '~hooks';
// import { getFriendlyName } from '~modules/users/transformers';

import styles from './UserColonies.css';

interface Props {
  user: User;
}

const MSG = defineMessages({
  currentUserNoColonies: {
    id: 'users.UserProfile.UserColonies.currentUserNoColonies',
    defaultMessage: `It looks like you have not joined any Colonies yet. You’ll need an invite link to join one. Ask your community for a link or {createColonyLink}.`,
  },
  otherUserNoColonies: {
    id: 'users.UserProfile.UserColonies.otherUserNoColonies',
    defaultMessage: `It looks like {friendlyUsername} hasn't joined any Colonies yet. You’ll might want to send them an invite link from a Colony you're part of.`,
  },
  createColonyLink: {
    id: 'users.UserProfile.UserColonies.createColonyLink',
    defaultMessage: `create a new colony`,
  },
});

const displayName = 'users.UserProfile.UserColonies';

const UserColonies = ({ user: { walletAddress, watchlist, name } }: Props) => {
  const { user: currentUser } = useAppContext();
  // const colonyAddresses = useMemo(() => watchlist.)
  // const friendlyName = getFriendlyName(user);
  // @TODO we should probably get the full colonies and pass them down to colonyGrid
  // const { data } = useUserColonyAddressesQuery({
  //   variables: { address: user.profile.walletAddress },
  // });

  // @TODO we want a proper spinner loader here eventually
  // if (!data) return null;
  // const {
  //   user: { colonyAddresses },
  // } = data;
  const isCurrentUser = currentUser?.walletAddress === walletAddress;
  return (
    <ColonyGrid
      colonies={watchlist?.items || []}
      // colonyAddresses={[]}
      emptyStateDescription={
        isCurrentUser ? MSG.currentUserNoColonies : MSG.otherUserNoColonies
      }
      emptyStateDescriptionValues={
        isCurrentUser
          ? {
              createColonyLink: (
                <Link
                  to={CREATE_COLONY_ROUTE}
                  text={MSG.createColonyLink}
                  className={styles.createColonyLink}
                />
              ),
            }
          : {
              friendlyUsername: (
                <span
                  /* title={friendlyName} */
                  className={styles.userHighlight}
                >
                  {/* {friendlyName} */}
                  {name}
                </span>
              ),
            }
      }
    />
  );
};

UserColonies.displayName = displayName;

export default UserColonies;
