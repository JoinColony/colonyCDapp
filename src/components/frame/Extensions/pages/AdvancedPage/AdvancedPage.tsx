import React, { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import NotificationBanner from '~common/Extensions/NotificationBanner';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/hooks';
import { useColonyContext, useColonyContractVersion, useMobile } from '~hooks';
import { canColonyBeUpgraded } from '~utils/checks';
import { formatText } from '~utils/intl';
import Button from '~v5/shared/Button';
import ColonyVersionWidget from '~v5/shared/ColonyVersionWidget';

const displayName = 'frame.Extensions.pages.AdvancedPage';

const AdvancedPage: FC = () => {
  const { colony } = useColonyContext();
  const { version } = colony || {};
  const { colonyContractVersion } = useColonyContractVersion();
  const isMobile = useMobile();

  useSetPageHeadingTitle(formatText({ id: 'advancedPage.title' }));

  const canUpgrade = canColonyBeUpgraded(colony, colonyContractVersion);

  return (
    <div>
      <h3 className="heading-4 mb-6">
        <FormattedMessage id="advancedPage.colony.title" />
      </h3>
      <div className="mb-4">
        <NotificationBanner
          status={canUpgrade ? 'warning' : 'success'}
          title={
            <FormattedMessage
              id={
                canUpgrade
                  ? 'advancedPage.version.warning'
                  : 'advancedPage.version.success'
              }
            />
          }
        />
      </div>
      <ColonyVersionWidget
        currentVersion={colonyContractVersion}
        lastVersion={version || 0}
        status={canUpgrade ? 'error' : 'success'}
      />
      <div className="divider my-6" />
      <h3 className="heading-4 mb-6">
        <FormattedMessage id="advancedPage.recovery.title" />
      </h3>
      <p className="text-md text-gray-600 mb-6">
        <FormattedMessage id="advancedPage.recovery.description" />
      </p>
      <div className="mb-6">
        <NotificationBanner
          status="info"
          title={<FormattedMessage id="advancedPage.recovery.notification" />}
          action={{
            type: 'redirect',
            href: 'https://colony.io/colonyjs/docs/colonyjs-core/#recovery-mode',
            actionText: <FormattedMessage id="text.learnMore" />,
          }}
          isAlt
        />
      </div>
      <div className="flex justify-end">
        {/* @TODO: Add recovery mode logic */}
        <Button
          mode="primarySolid"
          text={{ id: 'button.enterRecoveryMode' }}
          isFullSize={isMobile}
        />
      </div>
    </div>
  );
};

AdvancedPage.displayName = displayName;

export default AdvancedPage;
