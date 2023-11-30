import { useMemo, useState } from 'react';

import { useGetContributorCountQuery } from '~gql';
import { useColonyContext } from '~hooks';
import { ColonyContributor, SortDirection } from '~types';
import { notNull } from '~utils/arrays';
import {
  ContributorTypeFilter,
  StatusType,
} from '~v5/common/TableFiltering/types';
import { UserRole } from '~constants/permissions';

import { sortByReputationAscending, sortByReputationDescending } from './utils';

import useMemberFilters from './useMemberFilters';

const useColonyContributors = ({
  allMembers,
  filterPermissions,
  nativeDomainIds,
  filterStatus,
  contributorTypes,
  sortDirection,
  pageSize,
}: {
  allMembers: ColonyContributor[];
  filterPermissions: Record<UserRole, number[]>;
  nativeDomainIds: number[];
  filterStatus: StatusType | undefined;
  contributorTypes: Set<ContributorTypeFilter>;
  sortDirection: SortDirection;
  pageSize: number;
}) => {
  const { colony } = useColonyContext();
  const { colonyAddress = '' } = colony ?? {};

  const [page, setPage] = useState<number>(1);

  const visibleItems = page * pageSize;

  /*
   * To be considered a contributor, you must:
   * have at least one permission or
   * have at least some reputation in the selected domains
   */

  const allContributors = useMemo(() => {
    return (
      allMembers
        ?.filter(notNull)
        .filter(
          ({ hasReputation, hasPermissions }) =>
            hasReputation || hasPermissions,
        ) ?? []
    );
  }, [allMembers]);

  const filteredContributors = useMemberFilters({
    members: allContributors,
    contributorTypes,
    filterPermissions,
    nativeDomainIds,
    filterStatus,
    isContributorList: true,
  });

  const sortedContributors =
    sortDirection === SortDirection.Asc
      ? sortByReputationAscending(filteredContributors)
      : sortByReputationDescending(filteredContributors);

  const { data: totalData } = useGetContributorCountQuery({
    variables: {
      filter: {
        colonyAddress: { eq: colonyAddress },
        or: [{ hasPermissions: { eq: true } }, { hasReputation: { eq: true } }],
      },
    },
    skip: !colonyAddress,
  });

  const totalContributorCount = totalData?.searchColonyContributors?.total || 0;

  return {
    contributors: sortedContributors.slice(0, visibleItems),
    canLoadMore: sortedContributors.length > visibleItems,
    loadMore() {
      setPage((prevPage) => prevPage + 1);
    },
    totalContributorCount,
  };
};

export default useColonyContributors;
