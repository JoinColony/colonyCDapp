import { Extension } from '@colony/colony-js';
import { useMemo } from 'react';

import { Action } from '~constants/actions.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ColonyActionType } from '~gql';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useColonyContractVersion from '~hooks/useColonyContractVersion.ts';
import useExtensionData from '~hooks/useExtensionData.ts';
import { ActionTypes } from '~redux/actionTypes.ts';
import { type ClaimTokensOnChainsPayload } from '~redux/types/actions/colony.ts';
import { notNull } from '~utils/arrays/index.ts';
import { canColonyBeUpgraded } from '~utils/checks/index.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';

import {
  MANAGE_SUPPORTED_CHAINS_FIELD_NAME,
  ManageEntityOperation,
} from '../consts.ts';
import { useActiveActionType } from '../hooks/useActiveActionType.ts';
import { useCheckOperationType } from '../hooks/useCheckOperationType.ts';
import { type FinalizeSuccessCallback } from '../types.ts';

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

const useManageSupportedChainsSubmitButtonText = () => {
  const isRemoveOperation = useCheckOperationType(
    MANAGE_SUPPORTED_CHAINS_FIELD_NAME,
    ManageEntityOperation.Remove,
  );

  if (isRemoveOperation === null) {
    return 'button.manageChains';
  }

  return isRemoveOperation ? 'button.removeChain' : 'button.addChain';
};

export const useSubmitButtonText = () => {
  const selectedAction = useActiveActionType();
  const manageSupportedChainsText = useManageSupportedChainsSubmitButtonText();

  const selectedActionText = useMemo(() => {
    if (selectedAction === Action.ManageSupportedChains) {
      return manageSupportedChainsText;
    }
    return selectedAction && SUBMIT_BUTTON_TEXT_MAP[selectedAction];
  }, [selectedAction, manageSupportedChainsText]);

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

  return false;
};

export const useFinalizeSuccessCallback = (): FinalizeSuccessCallback => {
  const { colony } = useColonyContext();
  const colonyTokens = useMemo(
    () =>
      colony.tokens?.items.filter(notNull).map((token) => token.token) || [],
    [colony.tokens?.items],
  );

  const claimMintTokens = useAsyncFunction<ClaimTokensOnChainsPayload, void>({
    submit: ActionTypes.CLAIM_TOKENS_ON_CHAINS,
    error: ActionTypes.CLAIM_TOKENS_ON_CHAINS_ERROR,
    success: ActionTypes.CLAIM_TOKENS_ON_CHAINS_SUCCESS,
  });

  // We want to trigger this callback only when the Finalize button is pressed
  const onFinalizeSuccessCallback = (action) => {
    switch (action.type) {
      case ColonyActionType.MintTokensMotion:
      case ColonyActionType.MintTokensMultisig: {
        if (action.tokenAddress) {
          const token = colonyTokens.find(
            (colonyToken) => colonyToken.tokenAddress === action.tokenAddress,
          );
          const tokenAddressesGroupedByChain = [
            {
              chainId: token?.chainMetadata?.chainId,
              tokenAddresses: [action.tokenAddress],
            },
          ];
          claimMintTokens({
            colonyAddress: action.colonyAddress,
            tokenAddressesGroupedByChain,
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
