import { Action } from '~constants/actions.ts';

export const useGetActionGroup = (actionType: Action) => {
  if (!actionType) {
    return null;
  }

  switch (actionType) {
    case Action.SimplePayment:
    case Action.StagedPayment:
    case Action.SplitPayment:
    case Action.BatchPayment:
    case Action.PaymentBuilder:
    case Action.StreamingPayment:
      return Action.PaymentGroup;
    case Action.CreateNewTeam:
    case Action.EditColonyDetails:
    case Action.EditExistingTeam:
    case Action.EnterRecoveryMode:
    case Action.ManagePermissions:
    case Action.ManageReputation:
    case Action.ManageTokens:
    case Action.ManageVerifiedMembers:
    case Action.MintTokens:
    case Action.TransferFunds:
    case Action.UnlockToken:
    case Action.UpgradeColonyVersion:
    case Action.UserPermissions:
      return Action.ManageColony;
    default:
      return null;
  }
};
