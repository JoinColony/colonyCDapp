import { type Colony, type User } from '~types/graphql.ts';
import { sanitizeHTML } from '~utils/strings.ts';

import { type EnterRecoveryModeFormValues } from './consts.ts';

export const getRecoveryModePayload = (
  colony: Colony,
  values: EnterRecoveryModeFormValues,
  user?: User | null,
) => ({
  colonyName: colony.name,
  colonyAddress: colony.colonyAddress,
  walletAddress: user?.walletAddress,
  annotationMessage: values.description
    ? sanitizeHTML(values.description)
    : undefined,
  customActionTitle: '',
});
