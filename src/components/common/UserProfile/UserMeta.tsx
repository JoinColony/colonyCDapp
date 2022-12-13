import React from 'react';
import { defineMessages } from 'react-intl';

import CopyableAddress from '~shared/CopyableAddress';
import ExternalLink from '~shared/ExternalLink';
import Heading from '~shared/Heading';
import Icon from '~shared/Icon';
import Link from '~shared/Link';
import UserMention from '~shared/UserMention';
import UserAvatar from '~shared/UserAvatar';

import { stripProtocol } from '~utils/strings';
import { useAppContext, useMobile } from '~hooks';
import { User } from '~types';

import styles from './UserMeta.css';

const componentDisplayName = 'common.UserProfile.UserMeta';

const MSG = defineMessages({
  editProfileTitle: {
    id: `${componentDisplayName}.editProfileTitle`,
    defaultMessage: 'Edit Profile',
  },
});

interface Props {
  user: User;
}

const UserMeta = ({ user: { walletAddress, profile }, user }: Props) => {
  const { displayName, bio, website, location } = profile || {};
  const { user: currentUser } = useAppContext();

  const currentWalletAddress = currentUser?.walletAddress;

  const isMobile = useMobile();
  return (
    <div className={styles.main}>
      <div data-test="userProfileAvatar">
        <UserAvatar
          className={styles.avatar}
          address={walletAddress || ''}
          notSet={!walletAddress}
          size={isMobile ? 'm' : 'xl'}
          user={user}
          preferThumbnail={false}
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
        {currentWalletAddress === walletAddress && (
          <Link className={styles.profileLink} to="/edit-profile">
            <Icon name="settings" title={MSG.editProfileTitle} />
          </Link>
        )}
      </div>
      <div className={styles.usernameContainer}>
        <UserMention user={user} hasLink={false} />
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
