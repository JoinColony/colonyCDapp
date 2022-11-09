import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

import ProfileTemplate from '~frame/ProfileTemplate';
import { getUserFromName } from '~gql';
import NotFoundRoute from '~routes/NotFoundRoute';

import UserMeta from './UserMeta';
import UserProfileSpinner from './UserProfileSpinner';
import UserColonies from './UserColonies';

import styles from './UserProfile.css';

const UserProfile = () => {
  const { username } = useParams();
  const {
    data: dataByName,
    loading: byNameLoading,
    error: byNameError,
  } = useQuery(gql(getUserFromName), {
    variables: {
      name: username,
    },
    fetchPolicy: 'network-only',
  });

  const user = dataByName?.getUserByName?.items[0];

  if (!user || byNameLoading) {
    return <UserProfileSpinner />;
  }

  if (byNameError || !dataByName?.getUserByName?.items?.length) {
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

export default UserProfile;
