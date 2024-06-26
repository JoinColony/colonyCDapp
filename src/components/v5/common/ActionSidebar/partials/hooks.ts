import { Extension } from '@colony/colony-js';
import { useMemo } from 'react';

import { Action } from '~constants/actions.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useColonyContractVersion from '~hooks/useColonyContractVersion.ts';
import useExtensionData from '~hooks/useExtensionData.ts';
import { canColonyBeUpgraded } from '~utils/checks/index.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';

import { useActiveActionType } from '../hooks/useActiveActionType.ts';

const SUBMIT_BUTTON_TEXT_MAP: Partial<Record<Action, string>> = {
  [Action.PaymentBuilder]: 'button.createPayment',
  [Action.SimplePayment]: 'button.createPayment',
  [Action.BatchPayment]: 'button.createPayment',
  [Action.SplitPayment]: 'button.createPayment',
  [Action.StagedPayment]: 'button.createPayment',
  [Action.StreamingPayment]: 'button.createStream',
  [Action.TransferFunds]: 'button.createTransfer',
  [Action.MintTokens]: 'button.createTokens',
  [Action.UnlockToken]: 'button.unlockToken',
  [Action.ManageTokens]: 'button.updateTokens',
  [Action.EditColonyDetails]: 'button.editDetails',
  [Action.EditExistingTeam]: 'button.editTeam',
  [Action.CreateNewTeam]: 'button.createTeam',
  [Action.ManageReputation]: 'button.updateReputation',
  [Action.ManagePermissions]: 'button.changePermissions',
  [Action.UpgradeColonyVersion]: 'button.upgradeVersion',
  [Action.EnterRecoveryMode]: 'button.enterRecovery',
  [Action.ManageColonyObjectives]: 'button.updateObjective',
  [Action.CreateNewIntegration]: 'button.createIntegration',
  [Action.CreateDecision]: 'button.createDecision',
  [Action.ManageVerifiedMembers]: 'button.updateVerified',
};

export const useSubmitButtonText = () => {
  const selectedAction = useActiveActionType();
  const selectedActionText =
    selectedAction && SUBMIT_BUTTON_TEXT_MAP[selectedAction];

  return useMemo(
    () =>
      formatText({
        id: selectedActionText || 'button.createAction',
      }),
    [selectedActionText],
  );
};

export const useSubmitButtonDisabled = () => {
  const { colony } = useColonyContext();
  const { colonyContractVersion } = useColonyContractVersion();
  const canUpgrade = canColonyBeUpgraded(colony, colonyContractVersion);

  const isNativeTokenUnlocked = !!colony.status?.nativeToken?.unlocked;
  const selectedAction = useActiveActionType();

  switch (selectedAction) {
    case Action.UnlockToken:
      return isNativeTokenUnlocked;
    case Action.UpgradeColonyVersion:
      return !canUpgrade;
    default:
      return false;
  }
};

export const useIsFieldDisabled = () => {
  const { extensionData } = useExtensionData(Extension.VotingReputation);
  const selectedAction = useActiveActionType();
  const isExtensionEnabled =
    extensionData &&
    isInstalledExtensionData(extensionData) &&
    extensionData.isEnabled;

  if (selectedAction === Action.CreateDecision && !isExtensionEnabled) {
    return true;
  }

  return false;
};
