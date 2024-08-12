import { Extension } from '@colony/colony-js';
import { useMemo } from 'react';

import { Action } from '~constants/actions.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ColonyActionType } from '~gql';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useColonyContractVersion from '~hooks/useColonyContractVersion.ts';
import useExtensionData from '~hooks/useExtensionData.ts';
import { ActionTypes } from '~redux/actionTypes.ts';
import { canColonyBeUpgraded } from '~utils/checks/index.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';

import { useActiveActionType } from '../hooks/useActiveActionType.ts';
import {
  type ClaimMintTokensActionParams,
  type FinalizeSuccessCallback,
} from '../types.ts';

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
  [Action.CreateNewIntegration]: 'button.createIntegration',
  [Action.CreateDecision]: 'button.createDecision',
  [Action.ManageVerifiedMembers]: 'button.updateVerified',
  [Action.ArbitraryTxs]: 'button.createTransaction',
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
  const {
    extensionData: votingReputationExtensionData,
    loading: votingReputationLoading,
  } = useExtensionData(Extension.VotingReputation);

  const {
    extensionData: stagedExpenditureExtensionData,
    loading: stagedExpenditureLoading,
  } = useExtensionData(Extension.StagedExpenditure);

  const {
    extensionData: streamingPaymentsExtensionData,
    loading: streamingPaymentsLoading,
  } = useExtensionData(Extension.StreamingPayments);

  const selectedAction = useActiveActionType();

  const isVotingReputationExtensionEnabled =
    votingReputationExtensionData &&
    isInstalledExtensionData(votingReputationExtensionData) &&
    votingReputationExtensionData.isEnabled;

  if (
    selectedAction === Action.CreateDecision &&
    !isVotingReputationExtensionEnabled &&
    !votingReputationLoading
  ) {
    return true;
  }

  const isStagedExpenditureExtensionEnabled =
    stagedExpenditureExtensionData &&
    isInstalledExtensionData(stagedExpenditureExtensionData) &&
    stagedExpenditureExtensionData.isEnabled;

  if (
    selectedAction === Action.StagedPayment &&
    !isStagedExpenditureExtensionEnabled &&
    !stagedExpenditureLoading
  ) {
    return true;
  }

  const isStreamingPaymentsExtensionEnabled =
    streamingPaymentsExtensionData &&
    isInstalledExtensionData(streamingPaymentsExtensionData) &&
    streamingPaymentsExtensionData.isEnabled;

  if (
    selectedAction === Action.StreamingPayment &&
    !isStreamingPaymentsExtensionEnabled &&
    !streamingPaymentsLoading
  ) {
    return true;
  }

  return false;
};

export const useFinalizeSuccessCallback = (): FinalizeSuccessCallback => {
  const claimMintTokens = useAsyncFunction<ClaimMintTokensActionParams, void>({
    submit: ActionTypes.CLAIM_TOKEN,
    error: ActionTypes.CLAIM_TOKEN_ERROR,
    success: ActionTypes.CLAIM_TOKEN_SUCCESS,
  });

  // We want to trigger this callback only when the Finalize button is pressed
  const onFinalizeSuccessCallback = (action) => {
    switch (action.type) {
      case ColonyActionType.MintTokensMotion:
      case ColonyActionType.MintTokensMultisig: {
        if (action.tokenAddress) {
          claimMintTokens({
            tokenAddresses: [action.tokenAddress],
            colonyAddress: action.colonyAddress,
          }).catch(() => {
            console.error(`An error occured while claiming tokens`);
          });
        }

        break;
      }
      default: {
        break;
      }
    }
  };

  return {
    onFinalizeSuccessCallback,
  };
};
