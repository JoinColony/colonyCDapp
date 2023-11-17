import { ColonyRole } from '@colony/colony-js';
import { useMemo, useState } from 'react';

import { useGetColonyContributorsQuery } from '~gql';
import { notNull } from '~utils/arrays';
import {
  ContributorTypeFilter,
  StatusType,
} from '~v5/common/TableFiltering/types';
import useColonyContext from '../useColonyContext';
import useMemberFilters from './useMemberFilters';
import { SortDirection } from '~types';
import { updateQuery } from './utils';

const useAllMembers = ({
  filterPermissions,
  nativeDomainIds,
  filterStatus,
  contributorTypes,
  sortDirection,
  pageSize,
}: {
  filterPermissions: ColonyRole[];
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

  const { data, fetchMore, loading } = useGetColonyContributorsQuery({
    variables: {
      colonyAddress,
      sortDirection,
      limit: pageSize * 3,
    },
    skip: !colonyAddress,
  });

  const { items, nextToken } = data?.getContributorsByColony || {};

  /*
   * To be considered a member, you must either:
   * be watching the colony, or
   * be verified in the colony, or
   * have at least one permission in any domain
   * have at least some reputation in any domain
   */

  const allMembers = useMemo(
    () =>
      items
        ?.filter(notNull)
        .filter(
          ({ isVerified, hasPermissions, hasReputation, isWatching }) =>
            isWatching || hasPermissions || hasReputation || isVerified,
        ) ?? [],
    [items],
  );

  const filteredMembers = useMemberFilters({
    members: allMembers,
    contributorTypes,
    filterPermissions,
    nativeDomainIds,
    filterStatus,
  });

  // We need to ensure that the user always sees the (pageSize * pageNo) number of items.
  // Given that it's possible for our filtering to reduce the database results below this number,
  // we fetch more data in the background whenever this happens, and then only show up to the (pageSize * pageNo)
  // number of items.

  if (filteredMembers.length < visibleItems && nextToken) {
    fetchMore({
      variables: { nextToken },
      updateQuery,
    });
  }

  const verifiedMembers = useMemo(
    () => filteredMembers.filter(({ isVerified }) => isVerified),
    [filteredMembers],
  );

  return {
    members: filteredMembers.slice(0, visibleItems),
    verifiedMembers,
    canLoadMore: filteredMembers.length > visibleItems || !!nextToken,
    loadMore() {
      setPage((prevPage) => prevPage + 1);
    },
    loading,
  };
};

export default useAllMembers;
