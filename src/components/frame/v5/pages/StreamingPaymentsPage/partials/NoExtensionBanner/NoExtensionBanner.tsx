import { Extension } from '@colony/colony-js';
import { WarningCircle } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { useExtensionItem } from '~common/Extensions/ExtensionItem/hooks.ts';
import NotificationBanner from '~v5/shared/NotificationBanner/NotificationBanner.tsx';

const displayName = 'v5.pages.StreamingPaymentsPage.partials.NoExtensionBanner';

const MSG = defineMessages({
  bannerInfo: {
    id: `${displayName}.bannerInfo`,
    defaultMessage: 'Streaming payments extension is currently not enabled.',
  },
  link: {
    id: `${displayName}.link`,
    defaultMessage: 'View extension',
  },
});

const NoExtensionBanner = () => {
  const { formatMessage } = useIntl();

  const { extensionUrl } = useExtensionItem(Extension.StreamingPayments);

  return (
    <div className="pb-9">
      <NotificationBanner
        status="warning"
        icon={WarningCircle}
        callToAction={<Link to={extensionUrl}>{formatMessage(MSG.link)}</Link>}
      >
        {formatMessage(MSG.bannerInfo)}
      </NotificationBanner>
    </div>
  );
};

NoExtensionBanner.displayName = displayName;

export default NoExtensionBanner;
