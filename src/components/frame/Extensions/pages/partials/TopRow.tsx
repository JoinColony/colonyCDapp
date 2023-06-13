import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';

import NotificationBanner from '~common/Extensions/NotificationBanner';
import { isInstalledExtensionData } from '~utils/extensions';
import { useFetchActiveInstallsExtension } from '../ExtensionDetailsPage/hooks';
import { TopRowProps } from './types';
import Icon from '~shared/Icon';
import ExtensionStatusBadge from '~common/Extensions/ExtensionStatusBadge';
import ActionButtons from './ActionButtons';
import { MAX_INSTALLED_NUMBER } from '~constants';

const displayName = 'frame.Extensions.pages.partials.TopRow';

const TopRow: FC<TopRowProps> = ({ extensionData }) => {
  const { formatMessage } = useIntl();
  const [isPermissionEnabled, setIsPermissionEnabled] = useState(false);
  const { oneTxPaymentData, votingReputationData } =
    useFetchActiveInstallsExtension();

  const showEnableBanner =
    extensionData.extensionId !== 'VotingReputation' &&
    !isInstalledExtensionData(extensionData);

  const activeInstalls = Number(
    extensionData.extensionId === 'OneTxPayment'
      ? oneTxPaymentData
      : votingReputationData,
  );

  return (
    <>
      {showEnableBanner && (
        <div className="mb-6">
          <NotificationBanner
            title={
              isPermissionEnabled
                ? { id: 'extensionReEnable.notification.updated' }
                : { id: 'extensionReEnable.notification.missing' }
            }
            status={isPermissionEnabled ? 'success' : 'warning'}
            actionText={
              isPermissionEnabled
                ? { id: 'extensionReEnable.notification.enabled' }
                : { id: 'extensionReEnable.notification.enable' }
            }
            actionType="call-to-action"
            onClick={() => setIsPermissionEnabled(true)}
          />
        </div>
      )}
      <div className="flex justify-between flex-col flex-wrap sm:items-center sm:flex-row sm:gap-6">
        <div className="flex flex-col sm:items-center sm:flex-row sm:gap-2 sm:grow">
          <div className="flex items-center shrink-0">
            <Icon name={extensionData.icon} appearance={{ size: 'large' }} />
            <h4 className="ml-2 text-xl font-semibold text-gray-900">
              {formatMessage(extensionData.name)}
            </h4>
          </div>
          <div className="flex items-center justify-between gap-4 mt-4 sm:mt-0 sm:grow">
            <ExtensionStatusBadge
              mode="payments"
              text={formatMessage({ id: 'status.payments' })}
            />
            {activeInstalls >= MAX_INSTALLED_NUMBER ? (
              <p className="text-gray-400 text-sm">
                {activeInstalls.toLocaleString('en-US')}{' '}
                {formatMessage({ id: 'active.installs' })}
              </p>
            ) : (
              <ExtensionStatusBadge mode="new" text={{ id: 'status.new' }} />
            )}
          </div>
        </div>
        <ActionButtons extensionData={extensionData} />
      </div>
    </>
  );
};

TopRow.displayName = displayName;

export default TopRow;
