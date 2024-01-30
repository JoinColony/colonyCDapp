import { type Colony, type User } from '~types/graphql.ts';

import { type EnterRecoveryModeFormValues } from './consts.ts';

export const getRecoveryModePayload = (
  colony: Colony,
  values: EnterRecoveryModeFormValues,
  user?: User | null,
) => ({
  colonyName: colony.name,
  colonyAddress: colony.colonyAddress,
  walletAddress: user?.walletAddress,
  annotationMessage: values.description,
  customActionTitle: '',
});
