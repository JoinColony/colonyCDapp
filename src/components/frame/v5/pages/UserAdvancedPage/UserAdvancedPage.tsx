import React from 'react';

import { useCanEditProfile } from '~hooks';
import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import Spinner from '~v5/shared/Spinner';

const displayName = 'v5.pages.UserAdvancedPage';

const UserAdvancedPage = () => {
  const { user } = useCanEditProfile();

  if (!user) {
    return null;
  }

  return (
    <Spinner loadingText={{ id: 'loading.userAdvancedPage' }}>
      <TwoColumns aside={<Navigation pageName="profile" />}>
        Advanced
      </TwoColumns>
    </Spinner>
  );
};

UserAdvancedPage.displayName = displayName;

export default UserAdvancedPage;
