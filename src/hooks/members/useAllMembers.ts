import { useMemo, useState } from 'react';

import { type UserRole } from '~constants/permissions.ts';
import { type ColonyContributor, SortDirection } from '~types/graphql.ts';
import { range } from '~utils/lodash.ts';
import {
  type ContributorTypeFilter,
  type StatusType,
} from '~v5/common/TableFiltering/types.ts';

import useMemberFilters from './useMemberFilters.ts';
import {
  sortByReputationAscending,
  sortByReputationDescending,
} from './utils.ts';

const useAllMembers = ({
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
  pageSize: number | ((pageNumber: number) => number);
}) => {
  const [page, setPage] = useState<number>(1);

  const getPageSizeNumber = (pageNumber: number) =>
    typeof pageSize === 'function' ? pageSize(pageNumber) : pageSize;

  const visibleItems = range(1, page + 1).reduce(
    (acc, pageNumber) => getPageSizeNumber(pageNumber) + acc,
    0,
  );

  const filteredMembers = useMemberFilters({
    members: allMembers,
    contributorTypes,
    filterPermissions,
    nativeDomainIds,
    filterStatus,
  });

  const sortedMembers =
    sortDirection === SortDirection.Asc
      ? sortByReputationAscending(filteredMembers)
      : sortByReputationDescending(filteredMembers);

  const verifiedMembers = useMemo(
    () => sortedMembers.filter(({ isVerified }) => isVerified),
    [sortedMembers],
  );

  return {
    members: sortedMembers,
    pagedMembers: sortedMembers.slice(0, visibleItems),
    verifiedMembers,
    canLoadMore: sortedMembers.length > visibleItems,
    loadMore() {
      setPage((prevPage) => prevPage + 1);
    },
  };
};

export default useAllMembers;
