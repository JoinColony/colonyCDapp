import { ColonyRole } from '@colony/colony-js';
import { uniqBy } from '~utils/lodash';

export const hasSomeRole = (
  roles: Partial<
    Omit<
      Record<`role_${ColonyRole}`, boolean | null | undefined>,
      'role_4' | 'role_7'
    >
  >,
  permissionsFilter: ColonyRole[],
) => {
  if (!permissionsFilter.length) {
    // if no permissions filters are set, just check user has at least one permission
    return Object.keys(roles).some((role) => !!roles[role]);
  }

  return permissionsFilter.some((permission) => !!roles[`role_${permission}`]);
};

export const updateQuery = (prev, { fetchMoreResult }) => {
  if (!fetchMoreResult.getContributorsByColony) return prev;

  const mergedItems = uniqBy(
    [
      ...(prev.getContributorsByColony?.items ?? []),
      ...(fetchMoreResult.getContributorsByColony.items ?? []),
    ],
    'contributorAddress',
  );

  return {
    getContributorsByColony: {
      ...fetchMoreResult.getContributorsByColony,
      items: mergedItems,
    },
  };
};
