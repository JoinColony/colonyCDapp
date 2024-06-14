import { Action } from '~constants/actions.ts';
import { UserRole } from '~constants/permissions.ts';
import { ColonyActionType } from '~gql';

export const getMultiSigRequiredRole = (
  actionType: ColonyActionType | Action,
): UserRole => {
  switch (actionType) {
    case Action.MintTokens:
    case ColonyActionType.MintTokensMultisig:
      return UserRole.Owner;
    default:
      return UserRole.Owner;
  }
};
