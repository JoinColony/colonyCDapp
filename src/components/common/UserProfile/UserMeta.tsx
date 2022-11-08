import React from 'react';
import { defineMessages } from 'react-intl';
import { useMediaQuery } from 'react-responsive';

// import { AnyUser, useLoggedInUser } from '~data/index';
import { User } from '~types';

import CopyableAddress from '~shared/CopyableAddress';
import ExternalLink from '~shared/ExternalLink';
import Heading from '~shared/Heading';
import Icon from '~shared/Icon';
import Link from '~shared/Link';
import UserMention from '~shared/UserMention';
// import HookedUserAvatar from '~common/HookedUserAvatar';
import UserAvatar from '~shared/UserAvatar';
import { stripProtocol } from '~utils/strings';
import { useAppContext } from '~hooks';

import query from '~styles/queries.css';
import styles from './UserMeta.css';

const MSG = defineMessages({
  editProfileTitle: {
    id: 'users.UserProfile.UserMeta.editProfileTitle',
    defaultMessage: 'Edit Profile',
  },
});

// const UserAvatar = HookedUserAvatar({ fetchUser: false });

interface Props {
  user: User;
  // user: any;
}

const componentDisplayName = 'users.UserProfile.UserMeta';

const UserMeta = ({ user: { walletAddress, name, profile }, user }: Props) => {
  const { displayName, bio, website, location } = profile || {};
  const { user: currentUser } = useAppContext();
  const isMobile = useMediaQuery({ query: query.query700 });
  return (
    <div className={styles.main}>
      <div data-test="userProfileAvatar">
        <UserAvatar
          className={styles.avatar}
          address={walletAddress || ''}
          notSet={!walletAddress}
          size={isMobile ? 'm' : 'xl'}
          user={user}
        />
      </div>
      <div className={styles.headingContainer}>
        {displayName && (
          <Heading
            appearance={{ margin: 'none', size: 'medium', theme: 'dark' }}
            text={displayName}
            data-test="userProfileName"
          />
        )}
        {currentUser?.walletAddress === walletAddress && (
          <Link className={styles.profileLink} to="/edit-profile">
            <Icon name="settings" title={MSG.editProfileTitle} />
          </Link>
        )}
      </div>
      <div className={styles.usernameContainer}>
        <UserMention username={name || walletAddress} hasLink={false} />
      </div>
      <CopyableAddress>{walletAddress}</CopyableAddress>
      {bio && (
        <div className={styles.bioContainer}>
          <p data-test="userProfileBio">{bio}</p>
        </div>
      )}
      {website && (
        <div className={styles.websiteContainer} title={stripProtocol(website)}>
          <ExternalLink href={website} text={stripProtocol(website)} />
        </div>
      )}
      {location && (
        <div className={styles.locationContainer}>
          <Heading
            appearance={{ size: 'normal', weight: 'thin' }}
            text={location}
            data-test="userProfileLocation"
          />
        </div>
      )}
    </div>
  );
};

UserMeta.displayName = componentDisplayName;

export default UserMeta;
