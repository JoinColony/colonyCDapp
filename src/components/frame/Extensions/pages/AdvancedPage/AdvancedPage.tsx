import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import NotificationBanner from '~common/Extensions/NotificationBanner';
import { useColonyContext, useColonyContractVersion, useMobile } from '~hooks';
import { canColonyBeUpgraded } from '~utils/checks';
import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import Button from '~v5/shared/Button';
import ColonyVersionWidget from '~v5/shared/ColonyVersionWidget';
import Spinner from '~v5/shared/Spinner';

const displayName = 'frame.Extensions.pages.AdvancedPage';

const AdvancedPage: FC = () => {
  const { formatMessage } = useIntl();
  const { colony } = useColonyContext();
  const { version } = colony || {};
  const { colonyContractVersion } = useColonyContractVersion();
  const isMobile = useMobile();

  const canUpgrade = canColonyBeUpgraded(colony, colonyContractVersion);

  return (
    <Spinner loadingText={{ id: 'loading.advancedPage' }}>
      <TwoColumns aside={<Navigation pageName="extensions" />}>
        <h3 className="heading-4 mb-6">
          {formatMessage({ id: 'advancedPage.colony.title' })}
        </h3>
        <div className="mb-4">
          <NotificationBanner
            status={canUpgrade ? 'warning' : 'success'}
            title={{
              id: canUpgrade
                ? 'advancedPage.version.warning'
                : 'advancedPage.version.success',
            }}
          />
        </div>
        <ColonyVersionWidget
          currentVersion={colonyContractVersion}
          lastVersion={version || 0}
          status={canUpgrade ? 'error' : 'success'}
        />
        <div className="divider my-6" />
        <h3 className="heading-4 mb-6">
          {formatMessage({ id: 'advancedPage.recovery.title' })}
        </h3>
        <p className="text-md text-gray-600 mb-6">
          {formatMessage({ id: 'advancedPage.recovery.description' })}
        </p>
        <div className="mb-6">
          <NotificationBanner
            status="info"
            title={{
              id: 'advancedPage.recovery.notification',
            }}
            actionType="redirect"
            actionText={{ id: 'text.learnMore' }}
            // @TODO: Add redirect link
            redirectUrl="https://colony.io/colonyjs/docs/colonyjs-core/#recovery-mode"
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
      </TwoColumns>
    </Spinner>
  );
};

AdvancedPage.displayName = displayName;

export default AdvancedPage;
