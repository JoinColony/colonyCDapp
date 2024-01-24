import React from 'react';
import { defineMessages } from 'react-intl';
import { Navigate } from 'react-router-dom';

import { useAppContext } from '~context/AppContext';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext';
import LoadingTemplate from '~frame/LoadingTemplate';
import { LANDING_PAGE_ROUTE } from '~routes';
import { formatText } from '~utils/intl';

import UserAdvancedSettings from './partials/UserAdvancedSettings';

const displayName = 'v5.pages.UserAdvancedPage';

const MSG = defineMessages({
  loadingText: {
    id: `${displayName}.loadingText`,
    defaultMessage: 'Loading...',
  },
});

const UserAdvancedPage = () => {
  const { user, userLoading, walletConnecting } = useAppContext();

  useSetPageHeadingTitle(formatText({ id: 'userProfile.title' }));

  if (userLoading || walletConnecting) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  if (!user) {
    return <Navigate to={LANDING_PAGE_ROUTE} />;
  }

  return <UserAdvancedSettings />;
};

UserAdvancedPage.displayName = displayName;

export default UserAdvancedPage;
