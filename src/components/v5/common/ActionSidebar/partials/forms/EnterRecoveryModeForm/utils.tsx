import { Colony, User } from '~types';

import { EnterRecoveryModeFormValues } from './consts';

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
