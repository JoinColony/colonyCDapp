import { Colony, ColonyAction, ColonyActionType } from '~types';
import { generateMessageValues } from './getEventTitleValues';

import { mapColonyActionToExpectedFormat } from './mapItemToMessageFormat';

enum ActionTitleMessageKeys {
  Amount = 'amount',
  Direction = 'direction',
  FromDomain = 'fromDomain',
  Initiator = 'initiator',
  NewVersion = 'newVersion',
  Recipient = 'recipient',
  ReputationChange = 'reputationChange',
  ReputationChangeNumeral = 'reputationChangeNumeral',
  RolesChanged = 'rolesChanged',
  ToDomain = 'toDomain',
  TokenSymbol = 'tokenSymbol',
}

/* Maps actionTypes to message values as found in en-actions.ts */
const getMessageDescriptorKeys = (actionType: ColonyActionType) => {
  switch (true) {
    case actionType.includes(ColonyActionType.Payment):
      return [
        ActionTitleMessageKeys.Recipient,
        ActionTitleMessageKeys.Amount,
        ActionTitleMessageKeys.TokenSymbol,
      ];
    case actionType.includes(ColonyActionType.MoveFunds):
      return [
        ActionTitleMessageKeys.Amount,
        ActionTitleMessageKeys.TokenSymbol,
        ActionTitleMessageKeys.FromDomain,
        ActionTitleMessageKeys.ToDomain,
      ];
    case actionType.includes(ColonyActionType.UnlockToken):
      return [ActionTitleMessageKeys.TokenSymbol];
    case actionType.includes(ColonyActionType.MintTokens):
      return [
        ActionTitleMessageKeys.Amount,
        ActionTitleMessageKeys.TokenSymbol,
      ];
    case actionType.includes(ColonyActionType.CreateDomain):
      return [ActionTitleMessageKeys.FromDomain];
    case actionType.includes(ColonyActionType.VersionUpgrade):
      return [ActionTitleMessageKeys.NewVersion];
    case actionType.includes(ColonyActionType.EditDomain):
      return [ActionTitleMessageKeys.FromDomain];
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
      ];

    default:
      return [];
  }
};

/* Returns the correct message values according to the action type. */
const getActionTitleValues = (item: ColonyAction, colony?: Colony) => {
  const updatedItem = mapColonyActionToExpectedFormat(item, colony);
  const keys = getMessageDescriptorKeys(item.type);
  return generateMessageValues(updatedItem, keys, {
    actionType: item.type,
  });
};

export default getActionTitleValues;
