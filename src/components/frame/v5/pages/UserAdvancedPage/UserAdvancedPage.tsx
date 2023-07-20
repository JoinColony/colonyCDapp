import React from 'react';

import { useCanEditProfile } from '~hooks';
import UserAdvancedSettings from './partials/UserAdvancedSettings';

const displayName = 'v5.pages.UserAdvancedPage';

const UserAdvancedPage = () => {
  const { user } = useCanEditProfile();

  if (!user) {
    return null;
  }

  return <UserAdvancedSettings />;
};

UserAdvancedPage.displayName = displayName;

export default UserAdvancedPage;
