import {
  ExtendedColonyActionType,
  type AnyActionType,
} from '~types/actions.ts';
import {
  type ColonyAction,
  ColonyActionType,
  type Colony,
} from '~types/graphql.ts';
import {
  getExtendedActionType,
  safeActionTypes,
} from '~utils/colonyActions.ts';

import { generateMessageValues } from './getEventTitleValues.ts';
import { mapColonyActionToExpectedFormat } from './mapItemToMessageFormat.tsx';

import type React from 'react';

export enum ActionTitleMessageKeys {
  Amount = 'amount',
  Direction = 'direction',
  FromDomain = 'fromDomain',
  Initiator = 'initiator',
  Members = 'members',
  NewVersion = 'newVersion',
  Version = 'version',
  Recipient = 'recipient',
  ReputationChange = 'reputationChange',
  ReputationChangeNumeral = 'reputationChangeNumeral',
  RolesChanged = 'rolesChanged',
  ToDomain = 'toDomain',
  TokenSymbol = 'tokenSymbol',
  ChainName = 'chainName',
  VerifiedMembers = 'verifiedMembers',
  SafeTransactionTitle = 'safeTransactionTitle',
}

/* Maps actionTypes to message values as found in en-actions.ts */
const getMessageDescriptorKeys = (actionType: AnyActionType) => {
  switch (true) {
    case actionType.includes(ColonyActionType.Payment):
      return [
        ActionTitleMessageKeys.Recipient,
        ActionTitleMessageKeys.Amount,
        ActionTitleMessageKeys.TokenSymbol,
        ActionTitleMessageKeys.Initiator,
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
      ];
    case actionType.includes(ColonyActionType.EmitDomainReputationReward):
      return [
        ActionTitleMessageKeys.Recipient,
        ActionTitleMessageKeys.ReputationChangeNumeral,
        ActionTitleMessageKeys.ReputationChange,
      ];
    case actionType.includes(ColonyActionType.SetUserRoles):
      return [
        ActionTitleMessageKeys.RolesChanged,
        ActionTitleMessageKeys.Direction,
        ActionTitleMessageKeys.FromDomain,
        ActionTitleMessageKeys.Recipient,
        ActionTitleMessageKeys.Initiator,
      ];
    case actionType.includes(ExtendedColonyActionType.AddSafe):
      return [ActionTitleMessageKeys.ChainName];
    case actionType.includes(ColonyActionType.CreateDecisionMotion):
      return [ActionTitleMessageKeys.Initiator];
    case actionType.includes(ExtendedColonyActionType.UpdateColonyObjective):
      return [ActionTitleMessageKeys.Initiator];
    case actionType.includes(ExtendedColonyActionType.UpdateTokens):
      return [ActionTitleMessageKeys.Initiator];
    case safeActionTypes.some((type) => actionType.includes(type)):
      return [ActionTitleMessageKeys.SafeTransactionTitle];
    case actionType.includes(ColonyActionType.AddVerifiedMembers):
      return [ActionTitleMessageKeys.Members, ActionTitleMessageKeys.Initiator];
    case actionType.includes(ColonyActionType.RemoveVerifiedMembers):
      return [ActionTitleMessageKeys.Members, ActionTitleMessageKeys.Initiator];
    default:
      return [];
  }
};

/* Returns the correct message values according to the action type. */
const getActionTitleValues = (
  actionData: ColonyAction,
  colony: Colony,
  keyFallbackValues?: Partial<Record<ActionTitleMessageKeys, React.ReactNode>>,
) => {
  const { isMotion, pendingColonyMetadata } = actionData;

  const updatedItem = mapColonyActionToExpectedFormat(
    actionData,
    colony,
    keyFallbackValues,
  );
  const actionType = getExtendedActionType(
    actionData,
    isMotion ? pendingColonyMetadata : colony.metadata,
  );
  const keys = getMessageDescriptorKeys(actionType);

  return generateMessageValues(updatedItem, keys, {
    actionType,
  });
};

export default getActionTitleValues;
