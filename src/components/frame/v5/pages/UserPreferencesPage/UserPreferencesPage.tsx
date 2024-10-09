import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';
import { Navigate } from 'react-router-dom';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import LoadingTemplate from '~frame/LoadingTemplate/index.ts';
import { LANDING_PAGE_ROUTE } from '~routes/index.ts';
import { formatText } from '~utils/intl.ts';

import EmailSection from './partials/EmailSection/EmailSection.tsx';
import NotificationSettingsSection from './partials/NotificationSettingsSection/NotificationSettingsSection.tsx';
import WalletSection from './partials/WalletSection.tsx';

const displayName = 'v5.pages.UserPreferencesPage';

const MSG = defineMessages({
  loadingText: {
    id: `${displayName}.loadingText`,
    defaultMessage: 'Fetching user preferences',
  },
});

const UserPreferencesPage: FC = () => {
  const { user, userLoading, walletConnecting } = useAppContext();

  useSetPageHeadingTitle(formatText({ id: 'userPreferencesPage.title' }));

  if (userLoading || walletConnecting) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  if (!user) {
    return <Navigate to={LANDING_PAGE_ROUTE} />;
  }

  return (
    <div className="flex flex-col">
      <EmailSection />
      <WalletSection />
      <NotificationSettingsSection />
    </div>
  );
};

UserPreferencesPage.displayName = displayName;

export default UserPreferencesPage;
