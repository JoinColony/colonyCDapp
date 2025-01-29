import React from 'react';
import { defineMessages } from 'react-intl';
import { Navigate } from 'react-router-dom';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import LoadingTemplate from '~frame/LoadingTemplate/index.ts';
import { LANDING_PAGE_ROUTE } from '~routes/index.ts';
import { formatText } from '~utils/intl.ts';

import UserAdvancedSettings from './partials/UserAdvancedSettings/index.ts';

const displayName = 'v5.pages.UserAdvancedPage';

const MSG = defineMessages({
  loadingText: {
    id: `${displayName}.loadingText`,
    defaultMessage: 'Loading...',
  },
});

const UserAdvancedPage = () => {
  const { user, userLoading, walletConnecting, willWalletAutoConnect } =
    useAppContext();

  useSetPageHeadingTitle(formatText({ id: 'advancedSettings.title' }));

  if (userLoading || walletConnecting || (!user && willWalletAutoConnect)) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  if (!user) {
    return <Navigate to={LANDING_PAGE_ROUTE} />;
  }

  return <UserAdvancedSettings />;
};

UserAdvancedPage.displayName = displayName;

export default UserAdvancedPage;
