import React, { FC } from 'react';
import { defineMessages } from 'react-intl';
import { Navigate } from 'react-router-dom';

import { useSetPageHeadingTitle } from '~context';
import LoadingTemplate from '~frame/LoadingTemplate';
import { useAppContext } from '~hooks';
import { LANDING_PAGE_ROUTE } from '~routes';
import { formatText } from '~utils/intl';

import Rows from '../UserProfilePage/partials/Row';

import { useUserPreferencesPage } from './hooks';

const displayName = 'v5.pages.UserPreferencesPage';

const MSG = defineMessages({
  loadingText: {
    id: `${displayName}.loadingText`,
    defaultMessage: 'Fetching user preferences',
  },
});

const UserPreferencesPage: FC = () => {
  const { user, userLoading, walletConnecting } = useAppContext();
  const { handleSubmit, onSubmit, columnsList } = useUserPreferencesPage();

  useSetPageHeadingTitle(formatText({ id: 'userProfile.title' }));

  if (userLoading || walletConnecting) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  if (!user) {
    return <Navigate to={LANDING_PAGE_ROUTE} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-6">
        <h4 className="heading-4">
          {formatText({ id: 'userPreferencesPage.accountPreferences' })}
        </h4>
        <Rows groups={columnsList} className="flex-row" />
      </div>
    </form>
  );
};

UserPreferencesPage.displayName = displayName;

export default UserPreferencesPage;
