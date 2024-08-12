import {
  ExtendedColonyActionType,
  type AnyActionType,
} from '~types/actions.ts';
import {
  type ColonyAction,
  ColonyActionType,
  type Colony,
  type Expenditure,
} from '~types/graphql.ts';
import {
  getExtendedActionType,
  safeActionTypes,
} from '~utils/colonyActions.ts';

import { generateMessageValues } from './getEventTitleValues.ts';
import { useMapColonyActionToExpectedFormat } from './mapItemToMessageFormat.tsx';

import type React from 'react';

export enum ActionTitleMessageKeys {
  Amount = 'amount',
  Direction = 'direction',
  FromDomain = 'fromDomain',
  MultiSigAuthority = 'multiSigAuthority',
  Initiator = 'initiator',
  Members = 'members',
  NewVersion = 'newVersion',
  Version = 'version',
  Recipient = 'recipient',
  ReputationChange = 'reputationChange',
  ReputationChangeNumeral = 'reputationChangeNumeral',
  ToDomain = 'toDomain',
  TokenSymbol = 'tokenSymbol',
  ChainName = 'chainName',
  VerifiedMembers = 'verifiedMembers',
  SafeTransactionTitle = 'safeTransactionTitle',
  RecipientsNumber = 'recipientsNumber',
  TokensNumber = 'tokensNumber',
  SplitAmount = 'splitAmount',
  MilestonesCount = 'milestonesCount',
  Milestones = 'milestones',
  StagedAmount = 'stagedAmount',
  ArbitraryTransactionsLength = 'arbitraryTransactionsLength',
  ArbitraryMethod = 'arbitraryMethod',
  Period = 'period',
}

/* Maps actionTypes to message values as found in en-actions.ts */
const getMessageDescriptorKeys = (actionType: AnyActionType) => {
  switch (true) {
    case actionType === ColonyActionType.Payment:
      return [
        ActionTitleMessageKeys.Recipient,
        ActionTitleMessageKeys.Amount,
        ActionTitleMessageKeys.TokenSymbol,
        ActionTitleMessageKeys.Initiator,
      ];
    case actionType.includes(ColonyActionType.CreateStreamingPayment):
      return [
        ActionTitleMessageKeys.Recipient,
        ActionTitleMessageKeys.Amount,
        ActionTitleMessageKeys.TokenSymbol,
        ActionTitleMessageKeys.Initiator,
        ActionTitleMessageKeys.Period,
      ];
    case actionType.includes(ColonyActionType.MoveFunds):
      return [
        ActionTitleMessageKeys.Amount,
        ActionTitleMessageKeys.TokenSymbol,
        ActionTitleMessageKeys.FromDomain,
        ActionTitleMessageKeys.ToDomain,
        ActionTitleMessageKeys.Initiator,
      ];
    case actionType.includes(ColonyActionType.UnlockToken):
      return [
        ActionTitleMessageKeys.TokenSymbol,
        ActionTitleMessageKeys.Initiator,
      ];
    case actionType.includes(ColonyActionType.MintTokens):
      return [
        ActionTitleMessageKeys.Amount,
        ActionTitleMessageKeys.TokenSymbol,
        ActionTitleMessageKeys.Initiator,
      ];
    case actionType.includes(ColonyActionType.CreateDomain):
      return [
        ActionTitleMessageKeys.FromDomain,
        ActionTitleMessageKeys.Initiator,
      ];
    case actionType.includes(ColonyActionType.VersionUpgrade):
      return [
        ActionTitleMessageKeys.NewVersion,
        ActionTitleMessageKeys.Version,
        ActionTitleMessageKeys.Initiator,
      ];
    case actionType.includes(ColonyActionType.EditDomain):
      return [
        ActionTitleMessageKeys.FromDomain,
        ActionTitleMessageKeys.Initiator,
      ];
    case actionType.includes(ColonyActionType.ColonyEdit):
      return [ActionTitleMessageKeys.Initiator];
    case actionType.includes(ColonyActionType.Recovery):
      return [ActionTitleMessageKeys.Initiator];
    case actionType.includes(ColonyActionType.EmitDomainReputationPenalty):
      return [
        ActionTitleMessageKeys.Recipient,
        ActionTitleMessageKeys.ReputationChangeNumeral,
        ActionTitleMessageKeys.ReputationChange,
        ActionTitleMessageKeys.Initiator,
      ];
    case actionType.includes(ColonyActionType.EmitDomainReputationReward):
      return [
        ActionTitleMessageKeys.Recipient,
        ActionTitleMessageKeys.ReputationChangeNumeral,
        ActionTitleMessageKeys.ReputationChange,
        ActionTitleMessageKeys.Initiator,
      ];
    case actionType.includes(ColonyActionType.SetUserRoles):
      return [
        ActionTitleMessageKeys.Direction,
        ActionTitleMessageKeys.FromDomain,
        ActionTitleMessageKeys.Recipient,
        ActionTitleMessageKeys.Initiator,
        ActionTitleMessageKeys.MultiSigAuthority,
      ];
    case actionType.includes(ColonyActionType.CreateExpenditure):
      return [
        ActionTitleMessageKeys.Initiator,
        ActionTitleMessageKeys.RecipientsNumber,
        ActionTitleMessageKeys.TokensNumber,
      ];
    case actionType.includes(ColonyActionType.FundExpenditureMotion):
    case actionType.includes(ColonyActionType.FinalizeExpenditureMotion):
      return [
        ActionTitleMessageKeys.Initiator,
        ActionTitleMessageKeys.RecipientsNumber,
        ActionTitleMessageKeys.TokensNumber,
      ];
    case actionType.includes(ExtendedColonyActionType.StagedPayment):
      return [
        ActionTitleMessageKeys.Initiator,
        ActionTitleMessageKeys.Recipient,
        ActionTitleMessageKeys.StagedAmount,
        ActionTitleMessageKeys.TokenSymbol,
        ActionTitleMessageKeys.Milestones,
        ActionTitleMessageKeys.MilestonesCount,
        ActionTitleMessageKeys.TokensNumber,
      ];
    case actionType.includes(ExtendedColonyActionType.AddSafe):
      return [ActionTitleMessageKeys.ChainName];
    case actionType.includes(ColonyActionType.CreateDecisionMotion):
      return [ActionTitleMessageKeys.Initiator];
    /**
     * @deprecated
     * This is still needed to allow users to view existing Colony Objectives Actions
     */
    case actionType.includes(ExtendedColonyActionType.UpdateColonyObjective):
      return [ActionTitleMessageKeys.Initiator];
    case safeActionTypes.some((type) => actionType.includes(type)):
      return [ActionTitleMessageKeys.SafeTransactionTitle];
    case actionType.includes(ColonyActionType.AddVerifiedMembers):
      return [ActionTitleMessageKeys.Members, ActionTitleMessageKeys.Initiator];
    case actionType.includes(ColonyActionType.RemoveVerifiedMembers):
      return [ActionTitleMessageKeys.Members, ActionTitleMessageKeys.Initiator];
    case actionType.includes(ColonyActionType.ManageTokens):
      return [ActionTitleMessageKeys.Initiator];
    case actionType.includes(ExtendedColonyActionType.SplitPayment):
      return [
        ActionTitleMessageKeys.Initiator,
        ActionTitleMessageKeys.SplitAmount,
        ActionTitleMessageKeys.TokenSymbol,
      ];
    case actionType.includes(ColonyActionType.Payment):
      return [
        ActionTitleMessageKeys.Recipient,
        ActionTitleMessageKeys.Amount,
        ActionTitleMessageKeys.TokenSymbol,
        ActionTitleMessageKeys.Initiator,
      ];
    case actionType.includes(ColonyActionType.MakeArbitraryTransaction):
      return [
        ActionTitleMessageKeys.Initiator,
        ActionTitleMessageKeys.ArbitraryTransactionsLength,
        ActionTitleMessageKeys.ArbitraryMethod,
      ];
    default:
      return [];
  }
};

/* Returns the correct message values according to the action type. */
const useGetActionTitleValues = ({
  actionData,
  colony,
  keyFallbackValues,
  expenditureData,
  networkInverseFee,
}: {
  actionData: ColonyAction | null | undefined;
  colony: Pick<Colony, 'metadata' | 'nativeToken'> | undefined;
  keyFallbackValues?: Partial<Record<ActionTitleMessageKeys, React.ReactNode>>;
  expenditureData?: Expenditure;
  networkInverseFee?: string;
}) => {
  const { isMotion, pendingColonyMetadata } = actionData || {};

  const updatedItem = useMapColonyActionToExpectedFormat({
    actionData,
    colony,
    keyFallbackValues,
    expenditureData,
    networkInverseFee,
  });

  if (!actionData || !colony) {
    return {};
  }

  const actionType = getExtendedActionType(
    actionData,
    isMotion ? pendingColonyMetadata : colony.metadata,
  );
  const keys = getMessageDescriptorKeys(actionType);

  const messageValues = generateMessageValues(updatedItem, keys, {
    actionType,
  });

  return messageValues;
};

export default useGetActionTitleValues;
