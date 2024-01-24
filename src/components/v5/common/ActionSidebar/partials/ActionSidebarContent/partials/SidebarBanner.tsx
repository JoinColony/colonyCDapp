import { Extension } from '@colony/colony-js';
import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage, defineMessages } from 'react-intl';

import { ACTION } from '~constants/actions';
import { useColonyContext } from '~context/ColonyContext';
import useColonyContractVersion from '~hooks/useColonyContractVersion';
import useExtensionsData from '~hooks/useExtensionsData';
import { canColonyBeUpgraded } from '~utils/checks';
import { formatText } from '~utils/intl';
import { DecisionMethod } from '~v5/common/ActionSidebar/hooks';
import NotificationBanner from '~v5/shared/NotificationBanner';

import {
  ACTION_TYPE_FIELD_NAME,
  useCreateActionTypeNotification,
  useCreateActionTypeNotificationHref,
  DECISION_METHOD_FIELD_NAME,
} from '../../../consts';

const displayName =
  'v5.common.ActionSidebar.ActionSidebarContent.SidebarBanner';

const MSG = defineMessages({
  extensionPermissionNeeded: {
    id: `${displayName}.oneTxPaymentPermissionNeeded`,
    defaultMessage:
      'The {extensionName} extension is missing some or all of the permissions it needs to work.',
  },
});

export const SidebarBanner: FC = () => {
  const { watch } = useFormContext();
  const [selectedAction, decisionMethod] = watch([
    ACTION_TYPE_FIELD_NAME,
    DECISION_METHOD_FIELD_NAME,
  ]);

  const actionTypeNotificationTitle =
    useCreateActionTypeNotification(selectedAction);
  const actionTypeNofiticationHref =
    useCreateActionTypeNotificationHref(selectedAction);

  const { installedExtensionsData } = useExtensionsData();

  const requiredExtensionsWithoutPermission = installedExtensionsData.filter(
    (extension) => {
      const isOneTxPaymentExtensionAction =
        selectedAction === ACTION.SIMPLE_PAYMENT &&
        extension.extensionId === Extension.OneTxPayment;
      const isVotingReputationExtensionAction =
        decisionMethod === DecisionMethod.Reputation &&
        extension.extensionId === Extension.VotingReputation;

      if (isOneTxPaymentExtensionAction || isVotingReputationExtensionAction) {
        return extension.missingColonyPermissions.length > 0;
      }
      return false;
    },
  );

  const { colony } = useColonyContext();
  const { colonyContractVersion } = useColonyContractVersion();
  const canUpgrade = canColonyBeUpgraded(colony, colonyContractVersion);

  const showVersionUpToDateNotification =
    selectedAction === ACTION.UPGRADE_COLONY_VERSION && !canUpgrade;

  return (
    <>
      {actionTypeNotificationTitle && (
        <div className="mt-6">
          <NotificationBanner
            status="error"
            icon="warning-circle"
            callToAction={
              <a
                href={actionTypeNofiticationHref}
                target="_blank"
                rel="noreferrer"
              >
                {formatText({ id: 'learn.more' })}
              </a>
            }
          >
            {actionTypeNotificationTitle}
          </NotificationBanner>
        </div>
      )}
      {requiredExtensionsWithoutPermission.map((extension) => (
        <div className="mt-6" key={extension.extensionId}>
          <NotificationBanner status="warning" icon="warning-circle">
            <FormattedMessage
              {...MSG.extensionPermissionNeeded}
              values={{ extensionName: formatText(extension.name) }}
            />
          </NotificationBanner>
        </div>
      ))}
      {showVersionUpToDateNotification && (
        <div className="mt-6">
          <NotificationBanner icon="check-circle" status="success">
            <FormattedMessage id="actionSidebar.upToDate" />
          </NotificationBanner>
        </div>
      )}
    </>
  );
};
