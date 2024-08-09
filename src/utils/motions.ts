import { type Colony } from '~types/graphql.ts';

import { extractColonyRoles } from './colonyRoles.ts';
import { extractColonyDomains } from './domains.ts';

export const getMotionPayload = (isMultiSig: boolean, colony: Colony) => ({
  colonyRoles: extractColonyRoles(colony.roles),
  colonyDomains: extractColonyDomains(colony.domains),
  isMultiSig,
});
