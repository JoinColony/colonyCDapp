import { Extension } from '@colony/colony-js';
import { CheckCircle, WarningCircle } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage, defineMessages } from 'react-intl';

import { Action } from '~constants/actions.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useColonyContractVersion from '~hooks/useColonyContractVersion.ts';
import useExtensionsData from '~hooks/useExtensionsData.ts';
import { DecisionMethod } from '~types/actions.ts';
import { canColonyBeUpgraded } from '~utils/checks/canColonyBeUpgraded.ts';
import { formatText } from '~utils/intl.ts';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import { useIsFieldDisabled } from '~v5/common/ActionSidebar/partials/hooks.ts';
import ActionTypeNotification from '~v5/shared/ActionTypeNotification/ActionTypeNotification.tsx';
import NotificationBanner from '~v5/shared/NotificationBanner/index.ts';

const displayName =
  'v5.common.ActionSidebar.ActionSidebarContent.SidebarBanner';

const MSG = defineMessages({
  extensionPermissionNeeded: {
    id: `${displayName}.oneTxPaymentPermissionNeeded`,
    defaultMessage:
      'The {extensionName} extension is missing some or all of the permissions it needs to work.',
  },
});

interface Props {
  action?: Action;
}

export const SidebarBanner: FC<Props> = ({ action }) => {
  const { watch } = useFormContext();
  const [decisionMethod] = watch([DECISION_METHOD_FIELD_NAME]);

  const { installedExtensionsData } = useExtensionsData();

  const requiredExtensionsWithoutPermission = installedExtensionsData.filter(
    (extension) => {
      const isOneTxPaymentExtensionAction =
        action === Action.SimplePayment &&
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
  const isFieldDisabled = useIsFieldDisabled();

  const showVersionUpToDateNotification =
    action === Action.UpgradeColonyVersion && !canUpgrade;

  return (
    <>
      {action && (
        <ActionTypeNotification
          isFieldDisabled={isFieldDisabled}
          selectedAction={action}
          className="mt-7"
        />
      )}
      {requiredExtensionsWithoutPermission.map((extension) => (
        <div className="mt-6" key={extension.extensionId}>
          <NotificationBanner status="warning" icon={WarningCircle}>
            <FormattedMessage
              {...MSG.extensionPermissionNeeded}
              values={{ extensionName: formatText(extension.name) }}
            />
          </NotificationBanner>
        </div>
      ))}
      {showVersionUpToDateNotification && (
        <div className="mt-6">
          <NotificationBanner icon={CheckCircle} status="success">
            <FormattedMessage id="actionSidebar.upToDate" />
          </NotificationBanner>
        </div>
      )}
    </>
  );
};
