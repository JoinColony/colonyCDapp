import React from 'react';
import { defineMessages } from 'react-intl';

import ColonyGrid from '~shared/ColonyGrid';
import Link from '~shared/Link';

import { CREATE_COLONY_ROUTE } from '~routes/index';
import { User } from '~types';
import { useAppContext } from '~hooks';
import { notNull } from '~utils/arrays';

import styles from './UserColonies.css';

interface Props {
  user: User;
}

const displayName = 'common.UserProfile.UserColonies';

const MSG = defineMessages({
  currentUserNoColonies: {
    id: `${displayName}.currentUserNoColonies`,
    defaultMessage: `It looks like you have not joined any Colonies yet. You’ll need an invite link to join one. Ask your community for a link or {createColonyLink}.`,
  },
  otherUserNoColonies: {
    id: `${displayName}.otherUserNoColonies`,
    defaultMessage: `It looks like {friendlyUsername} hasn't joined any Colonies yet. You’ll might want to send them an invite link from a Colony you're part of.`,
  },
  createColonyLink: {
    id: `${displayName}.createColonyLink`,
    defaultMessage: `create a new colony`,
  },
});

const UserColonies = ({
  user: { walletAddress, watchlist, name, profile },
}: Props) => {
  const { user: currentUser } = useAppContext();
  const isCurrentUser = currentUser?.walletAddress === walletAddress;
  return (
    <ColonyGrid
      colonies={watchlist?.items.filter(notNull)}
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
                  title={profile?.displayName || name}
                  className={styles.userHighlight}
                >
                  {profile?.displayName || name}
                </span>
              ),
            }
      }
    />
  );
};

UserColonies.displayName = displayName;

export default UserColonies;
