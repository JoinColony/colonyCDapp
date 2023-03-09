import { Colony, User } from '~types';

export const getRecoveryModeDialogPayload = (
  colony: Colony,
  { annotation: annotationMessage },
  user: User | null | undefined,
) => ({
  colonyName: colony.name,
  colonyAddress: colony.colonyAddress,
  walletAddress: user?.walletAddress,
  annotationMessage,
});
