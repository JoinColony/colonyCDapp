import { ColonyRole } from '@colony/colony-js';

import { ColonyActionType } from '~gql';

export const getRolesNeededForMultiSigAction = (
  actionType: ColonyActionType,
): ColonyRole[] | undefined => {
  switch (actionType) {
    case ColonyActionType.MintTokensMultisig:
      return [ColonyRole.Root];
    default:
      return undefined;
  }
};
