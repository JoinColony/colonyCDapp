import { type ColonyRoleFragment } from '~gql';
import { type Colony } from '~types/graphql.ts';

import { notMaybe } from './arrays/index.ts';

export const extractColonyRoles = (
  colonyRoles: Colony['roles'],
): ColonyRoleFragment[] => {
  return colonyRoles?.items.filter(notMaybe) ?? [];
};
