import React, { FC } from 'react';
import { defineMessages } from 'react-intl';
import { Navigate } from 'react-router-dom';

import { useAppContext } from '~context/AppContext.tsx';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/index.ts';
import LoadingTemplate from '~frame/LoadingTemplate/index.ts';
import { LANDING_PAGE_ROUTE } from '~routes/index.ts';
import { formatText } from '~utils/intl.ts';

import Rows from '../UserProfilePage/partials/Row/index.ts';

import { useUserPreferencesPage } from './hooks.tsx';

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
