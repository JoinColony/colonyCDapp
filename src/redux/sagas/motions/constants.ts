import { ColonyRole } from '@colony/colony-js';

import { RootMotionMethodNames } from '~redux/types/index.ts';

// @TODO change the typedef once we implement support for more than just root motions
export const REQUIRED_MULTISIG_ROLES_BY_OPERATION: Record<
  RootMotionMethodNames,
  ColonyRole[]
> = {
  [RootMotionMethodNames.MintTokens]: [ColonyRole.Root],
  [RootMotionMethodNames.UnlockToken]: [ColonyRole.Root],
  [RootMotionMethodNames.Upgrade]: [ColonyRole.Root],
};
