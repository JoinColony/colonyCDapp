import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Navigate } from 'react-router-dom';

import { useAppContext } from '~context/AppContext.tsx';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/index.ts';
import LoadingTemplate from '~frame/LoadingTemplate/index.ts';
import { LANDING_PAGE_ROUTE } from '~routes/index.ts';
import { formatText } from '~utils/intl.ts';

const displayName = 'v5.pages.UserProfileExperimentalPage';

const MSG = defineMessages({
  loadingText: {
    id: `${displayName}.loadingText`,
    defaultMessage: 'Loading...',
  },
});

const UserAdvancedPage = () => {
  const { user, userLoading, walletConnecting } = useAppContext();
  const { formatMessage } = useIntl();

  useSetPageHeadingTitle(formatText({ id: 'userProfile.title' }));

  if (userLoading || walletConnecting) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  if (!user) {
    return <Navigate to={LANDING_PAGE_ROUTE} />;
  }

  /*
   * Plance all your user related experimental components here
   */
  return (
    <div className="flex flex-col gap-6">
      <h4 className="heading-4">
        {formatMessage({ id: 'experimentalSettings.title' })}
      </h4>
    </div>
  );
};

UserAdvancedPage.displayName = displayName;

export default UserAdvancedPage;
