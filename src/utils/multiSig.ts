import { type ColonyRole } from '@colony/colony-js';

import { PERMISSIONS_NEEDED_FOR_ACTION } from '~constants/actions.ts';
import { ColonyActionType } from '~gql';

export const getRolesNeededForMultiSigAction = (
  actionType: ColonyActionType,
): ColonyRole[] | undefined => {
  switch (actionType) {
    case ColonyActionType.MintTokensMultisig:
      return PERMISSIONS_NEEDED_FOR_ACTION.MintTokens;
    case ColonyActionType.CreateDecisionMultisig:
      return PERMISSIONS_NEEDED_FOR_ACTION.Decision;
    default:
      return undefined;
  }
};
