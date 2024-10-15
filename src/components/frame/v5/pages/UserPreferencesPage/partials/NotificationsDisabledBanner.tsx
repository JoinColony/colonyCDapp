import { WarningCircle } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  USER_ADVANCED_ROUTE,
  USER_HOME_ROUTE,
} from '~routes/routeConstants.ts';
import { formatText } from '~utils/intl.ts';
import NotificationBanner from '~v5/shared/NotificationBanner/NotificationBanner.tsx';

const displayName =
  'v5.pages.UserPreferencesPage.partials.NotificationsDisabledBanner';

const MSG = defineMessages({
  bannerText: {
    id: `${displayName}.bannerText`,
    defaultMessage:
      'Notifications are disabled. You can enable services in your Advanced settings.',
  },
  bannerLink: {
    id: `${displayName}.bannerLink`,
    defaultMessage: 'Advanced settings',
  },
});

const NotificationsDisabledBanner = () => {
  const advancedLink = (
    <Link to={`${USER_HOME_ROUTE}/${USER_ADVANCED_ROUTE}`}>
      {formatText(MSG.bannerLink)}
    </Link>
  );

  return (
    <div className="w-full">
      <NotificationBanner
        icon={WarningCircle}
        status="warning"
        callToAction={advancedLink}
      >
        {formatText(MSG.bannerText)}
      </NotificationBanner>
    </div>
  );
};

NotificationsDisabledBanner.displayName = displayName;
export default NotificationsDisabledBanner;
