import { ColonyRole } from '@colony/colony-js';
import { useMemo } from 'react';

import { SortingMethod } from '~gql';
import {
  ContributorTypeFilter,
  StatusType,
} from '~v5/common/TableFiltering/types';
import useColonyContext from '../useColonyContext';

import useContributorsWithReputation from './useContributorsWithReputation';
import usePermissionedContributors from './usePermissionedContributors';
import useFilterContributors from './useFilterContributors';

const useContributors = ({
  nativeDomainIds,
  permissions,
  contributorTypes,
  limit,
  ...rest
}: {
  nativeDomainIds: number[];
  permissions: ColonyRole[];
  contributorTypes: ContributorTypeFilter[];
  filterStatus: StatusType | undefined;
  limit: number;
  sortingMethod?: SortingMethod;
}) => {
  const { colony } = useColonyContext();
  const { colonyAddress = '' } = colony ?? {};

  const {
    contributorsWithReputation,
    loading: loadingWithRep,
    canFetchMore: moreContributorsWithRep,
  } = useContributorsWithReputation(
    colonyAddress,
    nativeDomainIds,
    contributorTypes,
    limit,
  );

  const {
    permissionedContributors,
    loading: loadingPermissioned,
    canFetchMore: morePermissionedContributors,
  } = usePermissionedContributors(
    colonyAddress,
    nativeDomainIds,
    permissions,
    limit,
  );

  const contributors = useMemo(
    () => ({
      contributorsWithReputation,
      permissionedContributors,
    }),
    [contributorsWithReputation, permissionedContributors],
  );

  const { filteredContributors, canFetchMore: moreFilteredContributors } =
    useFilterContributors({
      ...rest,
      contributorTypes,
      nativeDomainIds,
      permissions,
      contributors,
      limit,
    });

  return {
    contributors: filteredContributors,
    canFetchMore:
      moreContributorsWithRep ||
      morePermissionedContributors ||
      moreFilteredContributors,
    loading: loadingWithRep || loadingPermissioned,
  };
};

export default useContributors;
