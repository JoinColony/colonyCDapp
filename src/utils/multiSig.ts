import { UserRole } from '~constants/permissions.ts';
import { ColonyActionType } from '~gql';

export const getMultiSigRequiredRole = (
  actionType: ColonyActionType,
): UserRole => {
  switch (actionType) {
    case ColonyActionType.MintTokensMultisig:
      return UserRole.Owner;
    default:
      return UserRole.Owner;
  }
};
