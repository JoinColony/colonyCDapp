import { type ColonyRole, type Colony } from '~types/graphql.ts';

import { notMaybe } from './arrays/index.ts';

export const extractColonyRoles = (
  colonyRoles: Colony['roles'],
): ColonyRole[] => {
  return colonyRoles?.items.filter(notMaybe) ?? [];
};
