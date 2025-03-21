import { Extension } from '@colony/colony-js';
import { WarningCircle, PushPin } from '@phosphor-icons/react';
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
  newVersionInfo: {
    id: `${displayName}.newVersionInfo`,
    defaultMessage: `{isNewAvailable, select, true {New version available. View release notes for version details.} other {You are already on the latest version of Colony Network.}}`,
  },
  viewReleaseNotes: {
    id: `${displayName}.viewReleaseNotes`,
    defaultMessage: 'View release notes',
  },
});

const RELEASE_NOTES = 'https://github.com/JoinColony/colonyNetwork/releases';

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
        selectedAction === Action.SimplePayment &&
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
      <div className="mt-6">
        <NotificationBanner
          icon={PushPin}
          status="success"
          callToAction={
            <a href={RELEASE_NOTES} target="_blank" rel="noreferrer">
              {formatText(MSG.viewReleaseNotes)}
            </a>
          }
        >
          {formatText(MSG.newVersionInfo, {
            isNewAvailable: canUpgrade,
          })}
        </NotificationBanner>
      </div>
    </>
  );
};
