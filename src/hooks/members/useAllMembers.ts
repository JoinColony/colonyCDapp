import { useMemo, useState } from 'react';

import { UserRole } from '~constants/permissions.ts';
import { ColonyContributor, SortDirection } from '~types/graphql.ts';
import { range } from '~utils/lodash.ts';
import {
  ContributorTypeFilter,
  StatusType,
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

  /*
   * To be considered a member, you must either:
   * be watching the colony, or
   * be verified in the colony, or
   * have at least one permission in any domain
   * have at least some reputation in any domain
   */

  const members = useMemo(
    () =>
      allMembers.filter(
        ({ isVerified, hasPermissions, hasReputation, isWatching }) =>
          isWatching || hasPermissions || hasReputation || isVerified,
      ) ?? [],
    [allMembers],
  );

  const filteredMembers = useMemberFilters({
    members,
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
    totalMemberCount: members.length,
    totalMembers: members,
  };
};

export default useAllMembers;
