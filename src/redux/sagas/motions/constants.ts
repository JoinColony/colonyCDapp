import { type ColonyRole } from '@colony/colony-js';

import { PERMISSIONS_NEEDED_FOR_ACTION } from '~constants/actions.ts';
import { RootMotionMethodNames } from '~redux/types/index.ts';

// @TODO change the typedef once we implement support for more than just root motions
export const REQUIRED_MULTISIG_ROLES_BY_OPERATION: Record<
  RootMotionMethodNames,
  ColonyRole[]
> = {
  [RootMotionMethodNames.MintTokens]: PERMISSIONS_NEEDED_FOR_ACTION.MintTokens,
  [RootMotionMethodNames.MoveFunds]:
    PERMISSIONS_NEEDED_FOR_ACTION.TransferFunds,
  [RootMotionMethodNames.UnlockToken]:
    PERMISSIONS_NEEDED_FOR_ACTION.UnlockToken,
  [RootMotionMethodNames.Upgrade]:
    PERMISSIONS_NEEDED_FOR_ACTION.UpgradeColonyVersion,
};
