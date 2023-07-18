import React from 'react';

import { useCanEditProfile } from '~hooks';
import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import Spinner from '~v5/shared/Spinner';

const displayName = 'v5.pages.UserProfilePage';

const UserProfilePage = () => {
  const { user } = useCanEditProfile();

  if (!user) {
    return null;
  }

  return (
    <Spinner loadingText={{ id: 'loading.userProfilePage' }}>
      <TwoColumns aside={<Navigation pageName="profile" />}>Profile</TwoColumns>
    </Spinner>
  );
};

UserProfilePage.displayName = displayName;

export default UserProfilePage;
