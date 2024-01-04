import React from 'react';
import { useParams } from 'react-router-dom';

import ProfileTemplate from '~frame/ProfileTemplate';
import { useUserByNameOrAddress } from '~hooks';
import NotFoundRoute from '~routes/NotFoundRoute';

import UserColonies from './UserColonies';
import UserMeta from './UserMeta';
import UserProfileSpinner from './UserProfileSpinner';

import styles from './UserProfile.css';

const displayName = 'common.UserProfile';

const UserProfile = () => {
  const { username } = useParams();
  const { user, error, loading } = useUserByNameOrAddress(username || '');

  if (loading) {
    return <UserProfileSpinner />;
  }

  if (error || !user) {
    return <NotFoundRoute />;
  }

  return (
    <ProfileTemplate asideContent={<UserMeta user={user} />}>
      <section className={styles.sectionContainer}>
        <UserColonies user={user} />
      </section>
    </ProfileTemplate>
  );
};

UserProfile.displayName = displayName;

export default UserProfile;
