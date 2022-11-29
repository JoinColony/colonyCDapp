import React from 'react';
import { defineMessages } from 'react-intl';

import LoadingTemplate from '~frame/LoadingTemplate';

const displayName = 'common.UserProfile.UserProfileSpinner';

const MSG = defineMessages({
  loadingText: {
    id: `${displayName}.loadingText`,
    defaultMessage: 'Fetching a user profile',
  },
  loaderDescription: {
    id: `${displayName}.loaderDescription`,
    defaultMessage: 'Please wait while this user profile is being fetched.',
  },
});

const UserProfileSpinner = () => (
  <LoadingTemplate loadingText={MSG.loadingText} />
);

UserProfileSpinner.displayName = displayName;

export default UserProfileSpinner;
