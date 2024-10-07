import { type ColonyRole } from '@colony/colony-js';

// FIXME: @RESOLUTION: Kerry will refactor it. Create an issue
import { PERMISSIONS_NEEDED_FOR_ACTION } from '~constants/actions.ts';
import { RootMotionMethodNames } from '~redux/types/index.ts';

// FIXME: @RESOLUTION: Keep for now, just replace PERMISSIONS_NEEDED_FOR_ACTION
export const REQUIRED_MULTISIG_ROLES_BY_OPERATION: Record<
  RootMotionMethodNames,
  ColonyRole[][]
> = {
  [RootMotionMethodNames.MintTokens]: PERMISSIONS_NEEDED_FOR_ACTION.MintTokens,
  [RootMotionMethodNames.MoveFunds]:
    PERMISSIONS_NEEDED_FOR_ACTION.TransferFunds,
  [RootMotionMethodNames.UnlockToken]:
    PERMISSIONS_NEEDED_FOR_ACTION.UnlockToken,
  [RootMotionMethodNames.Upgrade]:
    PERMISSIONS_NEEDED_FOR_ACTION.UpgradeColonyVersion,
};
