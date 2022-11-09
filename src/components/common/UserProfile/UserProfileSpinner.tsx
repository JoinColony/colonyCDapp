import React from 'react';
import { defineMessages } from 'react-intl';

import LoadingTemplate from '~frame/LoadingTemplate';

const displayName = 'common.UserProfile.UserColonies';

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

const Spinner = () => <LoadingTemplate loadingText={MSG.loadingText} />;

Spinner.displayName = displayName;

export default Spinner;
