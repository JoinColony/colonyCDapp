import React, { useEffect } from 'react';
// import { Redirect } from 'react-router-dom';
import { useParams } from 'react-router-dom';

// import { NOT_FOUND_ROUTE } from '~routes/index';
import ProfileTemplate from '~frame/ProfileTemplate';
import { useAppContext } from '~hooks';
// import { useUserLazyQuery, useUserAddressQuery } from '~data/index';

import UserMeta from './UserMeta';
import UserProfileSpinner from './UserProfileSpinner';
import UserColonies from './UserColonies';
import styles from './UserProfile.css';

const UserProfile = () => {
  const { user, userLoading } = useAppContext();
  console.log(
    '🚀 ~ file: UserProfile.tsx ~ line 17 ~ UserProfile ~ user',
    user,
  );
  // const { data: userAddressData, error } = useUserAddressQuery({
  //   variables: {
  //     name: username || '',
  //   },
  // });

  // const [loadUser, { data }] = useUserLazyQuery();

  // useEffect(() => {
  //   if (userAddressData?.userAddress) {
  //     loadUser({
  //       variables: { address: userAddressData?.userAddress },
  //     });
  //   }
  // }, [loadUser, userAddressData]);

  // if (error) {
  //   return <Redirect to={NOT_FOUND_ROUTE} />;
  // }

  if (!user || userLoading) {
    return <UserProfileSpinner />;
  }

  // const { user } = data;

  return (
    <ProfileTemplate asideContent={<UserMeta user={user} />}>
      <section className={styles.sectionContainer}>
        <UserColonies user={user} />
      </section>
    </ProfileTemplate>
  );
};

export default UserProfile;
