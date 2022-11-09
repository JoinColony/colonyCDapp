import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { isAddress } from 'ethers/lib/utils';

import ProfileTemplate from '~frame/ProfileTemplate';
import { getUserFromName, getCurrentUser } from '~gql';
import NotFoundRoute from '~routes/NotFoundRoute';

import UserMeta from './UserMeta';
import UserProfileSpinner from './UserProfileSpinner';
import UserColonies from './UserColonies';

import styles from './UserProfile.css';

const UserProfile = () => {
  const { username } = useParams();
  const {
    data: dataByName,
    loading: loadingName,
    error: errorName,
  } = useQuery(gql(getUserFromName), {
    variables: {
      name: username,
    },
    fetchPolicy: 'network-only',
  });

  const {
    data: dataAddress,
    loading: loadingAddress,
    error: errorAddress,
  } = useQuery(gql(getCurrentUser), {
    variables: { address: username },
  });

  const user = isAddress(username || '')
    ? dataAddress?.getUserByAddress?.items[0]
    : dataByName?.getUserByName?.items[0];

  if (loadingName || loadingAddress) {
    return <UserProfileSpinner />;
  }

  if (errorName || errorAddress || !user) {
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
