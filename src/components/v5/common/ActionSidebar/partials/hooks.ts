import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { ACTION, Action } from '~constants/actions';
import { useEnabledExtensions } from '~hooks';
import { formatText } from '~utils/intl';
import { ACTION_TYPE_FIELD_NAME } from '../consts';

const ACTION_SUBMIT_BUTTON_TEXT: Partial<Record<Action, string>> = {
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
  [ACTION.AWARD_REPUTATION]: 'button.changeReputation',
  [ACTION.MANAGE_PERMISSIONS]: 'button.changePermissions',
  [ACTION.UPGRADE_COLONY_VERSION]: 'button.upgradeVersion',
  [ACTION.ENTER_RECOVERY_MODE]: 'button.enterRecovery',
  [ACTION.MANAGE_COLONY_OBJECTIVES]: 'button.updateObjective',
  [ACTION.CREATE_NEW_INTEGRATION]: 'button.createIntegration',
};

const MOTION_SUBMIT_BUTTON_TEXT: Partial<Record<Action, string>> = {
  [ACTION.SIMPLE_PAYMENT]: 'button.createMotion',
};

export const useSubmitButtonText = () => {
  const { isVotingReputationEnabled } = useEnabledExtensions();
  const selectedAction: Action | undefined = useWatch({
    name: ACTION_TYPE_FIELD_NAME,
  });

  const selectedTexts = isVotingReputationEnabled
    ? MOTION_SUBMIT_BUTTON_TEXT
    : ACTION_SUBMIT_BUTTON_TEXT;

  return useMemo(() => {
    if (!selectedAction || !selectedTexts[selectedAction]) {
      return formatText({
        id: isVotingReputationEnabled
          ? 'button.createMotion'
          : 'button.createAction',
      });
    }

    return formatText({
      id: selectedTexts[selectedAction],
    });
  }, [isVotingReputationEnabled, selectedAction, selectedTexts]);
};
