import React from 'react';
import { defineMessages } from 'react-intl';

import LoadingTemplate from '~frame/LoadingTemplate';

const displayName = 'common.UserProfile.UserProfileSpinner';

const MSG = defineMessages({
  loadingText: {
    id: `${displayName}.loadingText`,
    defaultMessage: 'Fetching user profile',
  },
});

const UserProfileSpinner = () => <LoadingTemplate loadingText={MSG.loadingText} />;

UserProfileSpinner.displayName = displayName;

export default UserProfileSpinner;
