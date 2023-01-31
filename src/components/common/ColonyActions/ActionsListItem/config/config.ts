import {
  Colony,
  ColonyActions,
  ColonyMotions,
  FormattedAction,
  UniversalMessageValues,
} from '~types';

import { mapItemToExpectedFormat } from './helpers';

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
const getMessageDescriptorKeys = (
  actionType: ColonyActions | ColonyMotions,
) => {
  switch (true) {
    case actionType.includes(ColonyActions.Payment):
      return [
        ActionTitleMessageKeys.Recipient,
        ActionTitleMessageKeys.Amount,
        ActionTitleMessageKeys.TokenSymbol,
      ];
    case actionType.includes(ColonyActions.MoveFunds):
      return [
        ActionTitleMessageKeys.Amount,
        ActionTitleMessageKeys.TokenSymbol,
        ActionTitleMessageKeys.FromDomain,
        ActionTitleMessageKeys.ToDomain,
      ];
    case actionType.includes(ColonyActions.UnlockToken):
      return [ActionTitleMessageKeys.TokenSymbol];
    case actionType.includes(ColonyActions.MintTokens):
      return [
        ActionTitleMessageKeys.Amount,
        ActionTitleMessageKeys.TokenSymbol,
      ];
    case actionType.includes(ColonyActions.CreateDomain):
      return [ActionTitleMessageKeys.FromDomain];
    case actionType.includes(ColonyActions.VersionUpgrade):
      return [ActionTitleMessageKeys.NewVersion];
    case actionType.includes(ColonyActions.EditDomain):
      return [ActionTitleMessageKeys.FromDomain];
    case actionType.includes(ColonyActions.Recovery):
      return [ActionTitleMessageKeys.Initiator];
    case actionType.includes(ColonyActions.EmitDomainReputationPenalty):
      return [
        ActionTitleMessageKeys.Recipient,
        ActionTitleMessageKeys.ReputationChangeNumeral,
        ActionTitleMessageKeys.ReputationChange,
      ];
    case actionType.includes(ColonyActions.EmitDomainReputationReward):
      return [
        ActionTitleMessageKeys.Recipient,
        ActionTitleMessageKeys.ReputationChangeNumeral,
        ActionTitleMessageKeys.ReputationChange,
      ];
    case actionType.includes(ColonyActions.SetUserRoles):
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
const getActionListItemTitleValues = (
  item: FormattedAction,
  colony?: Colony,
) => {
  const updatedItem = mapItemToExpectedFormat(item, colony);
  const keys = getMessageDescriptorKeys(item.actionType);
  const titleValues = keys.reduce<UniversalMessageValues>(
    (values, key) => {
      // eslint-disable-next-line no-param-reassign
      values[key] = updatedItem[key];
      return values;
    },
    { actionType: item.actionType },
  );

  return titleValues;
};

export default getActionListItemTitleValues;
