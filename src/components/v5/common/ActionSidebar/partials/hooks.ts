import { Extension } from '@colony/colony-js';
import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';

import { Action } from '~constants/actions.ts';
import { useColonyContext } from '~context/ColonyContext.tsx';
import useColonyContractVersion from '~hooks/useColonyContractVersion.ts';
import useExtensionData from '~hooks/useExtensionData.ts';
import { canColonyBeUpgraded } from '~utils/checks/index.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';

import { ACTION_TYPE_FIELD_NAME } from '../consts.tsx';

const SUBMIT_BUTTON_TEXT_MAP: Partial<Record<Action, string>> = {
  [Action.ADVANCED_PAYMENT]: 'button.createPayment',
  [Action.SIMPLE_PAYMENT]: 'button.createPayment',
  [Action.BATCH_PAYMENT]: 'button.createPayment',
  [Action.SPLIT_PAYMENT]: 'button.createPayment',
  [Action.STAGED_PAYMENT]: 'button.createPayment',
  [Action.STREAMING_PAYMENT]: 'button.createStream',
  [Action.TRANSFER_FUNDS]: 'button.createTransfer',
  [Action.MINT_TOKENS]: 'button.createTokens',
  [Action.UNLOCK_TOKEN]: 'button.unlockToken',
  [Action.MANAGE_TOKENS]: 'button.updateTokens',
  [Action.EDIT_COLONY_DETAILS]: 'button.editDetails',
  [Action.EDIT_EXISTING_TEAM]: 'button.editTeam',
  [Action.CREATE_NEW_TEAM]: 'button.createTeam',
  [Action.MANAGE_REPUTATION]: 'button.changeReputation',
  [Action.MANAGE_PERMISSIONS]: 'button.changePermissions',
  [Action.UPGRADE_COLONY_VERSION]: 'button.upgradeVersion',
  [Action.ENTER_RECOVERY_MODE]: 'button.enterRecovery',
  [Action.MANAGE_COLONY_OBJECTIVES]: 'button.updateObjective',
  [Action.CREATE_NEW_INTEGRATION]: 'button.createIntegration',
  [Action.CREATE_DECISION]: 'button.createDecision',
};

export const useSubmitButtonText = () => {
  const selectedAction: Action | undefined = useWatch({
    name: ACTION_TYPE_FIELD_NAME,
  });
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
  const selectedAction: Action | undefined = useWatch({
    name: ACTION_TYPE_FIELD_NAME,
  });

  switch (selectedAction) {
    case Action.UNLOCK_TOKEN:
      return isNativeTokenUnlocked;
    case Action.UPGRADE_COLONY_VERSION:
      return !canUpgrade;
    default:
      return false;
  }
};

export const useIsFieldDisabled = () => {
  const { extensionData } = useExtensionData(Extension.VotingReputation);
  const selectedAction: Action | undefined = useWatch({
    name: ACTION_TYPE_FIELD_NAME,
  });
  const isExtensionEnabled =
    extensionData &&
    isInstalledExtensionData(extensionData) &&
    extensionData.isEnabled;

  if (selectedAction === Action.CREATE_DECISION && !isExtensionEnabled) {
    return true;
  }

  return false;
};
