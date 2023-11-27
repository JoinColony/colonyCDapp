import { ColonyRole } from '@colony/colony-js';
import { uniqBy } from '~utils/lodash';

export const hasSomeRole = (roles: object, permissionsFilter: ColonyRole[]) => {
  if (!permissionsFilter.length) {
    // if no permissions filters are set, just check user has at least one permission
    return Object.keys(roles).some(
      (key) => key.startsWith('role_') && !!roles[key],
    );
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
