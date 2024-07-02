import { Id, type ColonyRole } from '@colony/colony-js';

import { PERMISSIONS_NEEDED_FOR_ACTION } from '~constants/actions.ts';
import { ColonyActionType } from '~gql';

export const getRolesNeededForMultiSigAction = ({
  actionType,
  createdIn,
}: {
  actionType: ColonyActionType;
  createdIn: number;
}): ColonyRole[] | undefined => {
  switch (actionType) {
    case ColonyActionType.MintTokensMultisig:
      return PERMISSIONS_NEEDED_FOR_ACTION.MintTokens;
    case ColonyActionType.SetUserRolesMultisig:
      if (!createdIn) {
        return undefined;
      }
      if (createdIn === Id.RootDomain) {
        return PERMISSIONS_NEEDED_FOR_ACTION.ManagePermissionsInRootDomain;
      }
      return PERMISSIONS_NEEDED_FOR_ACTION.ManagePermissionsInSubDomain;
    default:
      return undefined;
  }
};
