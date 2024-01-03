import React from 'react';
import { defineMessages } from 'react-intl';

import { useAppContext } from '~hooks';
import { CREATE_COLONY_ROUTE } from '~routes/index';
import ColonyGrid from '~shared/ColonyGrid';
import Link from '~shared/Link';
import { User } from '~types';

import styles from './UserColonies.css';

interface Props {
  user: User;
}

const displayName = 'common.UserProfile.UserColonies';

const MSG = defineMessages({
  currentUserNoColonies: {
    id: `${displayName}.currentUserNoColonies`,
    defaultMessage: `It looks like you have not joined any Colonies yet. You'll need an invite link to join one. Ask your community for a link or {createColonyLink}.`,
  },
  otherUserNoColonies: {
    id: `${displayName}.otherUserNoColonies`,
    defaultMessage: `It looks like {friendlyUsername} hasn't joined any Colonies yet. You might want to send them an invite link from a Colony you're part of.`,
  },
  createColonyLink: {
    id: `${displayName}.createColonyLink`,
    defaultMessage: `create a new colony`,
  },
  loadingColonies: {
    id: `${displayName}.loadingColonies`,
    defaultMessage: 'Loading colonies...',
  },
});

const UserColonies = ({ user: { walletAddress, profile } }: Props) => {
  const { user: currentUser } = useAppContext();
  const isCurrentUser = currentUser?.walletAddress === walletAddress;

  return (
    <ColonyGrid
      colonies={undefined}
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
                  title={profile?.displayName ?? ''}
                  className={styles.userHighlight}
                >
                  {profile?.displayName ?? ''}
                </span>
              ),
            }
      }
    />
  );
};

UserColonies.displayName = displayName;

export default UserColonies;
