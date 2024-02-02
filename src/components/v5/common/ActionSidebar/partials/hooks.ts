import { Extension } from '@colony/colony-js';
import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';

import { ACTION, type Action } from '~constants/actions.ts';
import { useColonyContext } from '~context/ColonyContext.tsx';
import useColonyContractVersion from '~hooks/useColonyContractVersion.ts';
import useExtensionData from '~hooks/useExtensionData.ts';
import { canColonyBeUpgraded } from '~utils/checks/index.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';

import { ACTION_TYPE_FIELD_NAME } from '../consts.tsx';

const SUBMIT_BUTTON_TEXT_MAP: Partial<Record<Action, string>> = {
  [ACTION.ADVANCED_PAYMENT]: 'button.createPayment',
  [ACTION.SIMPLE_PAYMENT]: 'button.createPayment',
  [ACTION.BATCH_PAYMENT]: 'button.createPayment',
  [ACTION.SPLIT_PAYMENT]: 'button.createPayment',
  [ACTION.STAGED_PAYMENT]: 'button.createPayment',
  [ACTION.STREAMING_PAYMENT]: 'button.createStream',
  [ACTION.TRANSFER_FUNDS]: 'button.createTransfer',
  [ACTION.MINT_TOKENS]: 'button.createTokens',
  [ACTION.UNLOCK_TOKEN]: 'button.unlockToken',
  [ACTION.MANAGE_TOKENS]: 'button.updateTokens',
  [ACTION.EDIT_COLONY_DETAILS]: 'button.editDetails',
  [ACTION.EDIT_EXISTING_TEAM]: 'button.editTeam',
  [ACTION.CREATE_NEW_TEAM]: 'button.createTeam',
  [ACTION.MANAGE_REPUTATION]: 'button.changeReputation',
  [ACTION.MANAGE_PERMISSIONS]: 'button.changePermissions',
  [ACTION.UPGRADE_COLONY_VERSION]: 'button.upgradeVersion',
  [ACTION.ENTER_RECOVERY_MODE]: 'button.enterRecovery',
  [ACTION.MANAGE_COLONY_OBJECTIVES]: 'button.updateObjective',
  [ACTION.CREATE_NEW_INTEGRATION]: 'button.createIntegration',
  [ACTION.CREATE_DECISION]: 'button.createDecision',
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
    case ACTION.UNLOCK_TOKEN:
      return isNativeTokenUnlocked;
    case ACTION.UPGRADE_COLONY_VERSION:
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

  if (selectedAction === ACTION.CREATE_DECISION && !isExtensionEnabled) {
    return true;
  }

  return false;
};
