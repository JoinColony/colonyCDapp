import { Extension } from '@colony/colony-js';
import { CheckCircle, WarningCircle } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage, defineMessages } from 'react-intl';

import { CoreAction } from '~actions';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { DecisionMethod } from '~gql';
import useColonyContractVersion from '~hooks/useColonyContractVersion.ts';
import useExtensionsData from '~hooks/useExtensionsData.ts';
import { canColonyBeUpgraded } from '~utils/checks/canColonyBeUpgraded.ts';
import { formatText } from '~utils/intl.ts';
import {
  ACTION_TYPE_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
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

export const SidebarBanner: FC = () => {
  const { watch } = useFormContext();
  const [selectedAction, decisionMethod] = watch([
    ACTION_TYPE_FIELD_NAME,
    DECISION_METHOD_FIELD_NAME,
  ]);

  const { installedExtensionsData } = useExtensionsData();

  const requiredExtensionsWithoutPermission = installedExtensionsData.filter(
    (extension) => {
      const isOneTxPaymentExtensionAction =
        selectedAction === CoreAction.Payment &&
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
    selectedAction === CoreAction.VersionUpgrade && !canUpgrade;

  return (
    <>
      {selectedAction && (
        <ActionTypeNotification
          isFieldDisabled={isFieldDisabled}
          selectedAction={selectedAction}
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
