import { ColonyRole } from '@colony/colony-js';

import { ColonyActionType } from '~gql';

export const getMultiSigRequiredRole = (
  actionType: ColonyActionType,
): ColonyRole => {
  switch (actionType) {
    case ColonyActionType.MintTokensMultisig:
      return ColonyRole.Root;
    default:
      return ColonyRole.Root;
  }
};
