import { useMemo, useState } from 'react';

import { useGetColonyContributorsQuery } from '~gql';
import { useColonyContext } from '~hooks';
import { SortDirection } from '~types';
import { notNull } from '~utils/arrays';
import {
  ContributorTypeFilter,
  StatusType,
} from '~v5/common/TableFiltering/types';
import { UserRole } from '~constants/permissions';

import { updateQuery } from './utils';
import useMemberFilters from './useMemberFilters';

const useColonyContributors = ({
  filterPermissions,
  nativeDomainIds,
  filterStatus,
  contributorTypes,
  sortDirection,
  pageSize,
}: {
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

  const { data, previousData, fetchMore, loading } =
    useGetColonyContributorsQuery({
      variables: {
        colonyAddress,
        sortDirection,
        limit: pageSize * 3,
      },
      skip: !colonyAddress,
      fetchPolicy: 'cache-and-network',
    });

  const { nextToken } = data?.getContributorsByColony || {};
  const { items } =
    data?.getContributorsByColony ||
    previousData?.getContributorsByColony ||
    {};

  /*
   * To be considered a contributor, you must:
   * have at least one permission or
   * have at least some reputation in the selected domains
   */

  const allContributors = useMemo(() => {
    return (
      items
        ?.filter(notNull)
        .filter(
          ({ hasReputation, hasPermissions }) =>
            hasReputation || hasPermissions,
        ) ?? []
    );
  }, [items]);

  const filteredContributors = useMemberFilters({
    members: allContributors,
    contributorTypes,
    filterPermissions,
    nativeDomainIds,
    filterStatus,
    isContributorList: true,
  });

  // We need to ensure that the user always sees the (pageSize * pageNo) number of items.
  // Given that it's possible for our filtering to reduce the database results below this number,
  // we fetch more data in the background whenever this happens, and then only show up to the (pageSize * pageNo)
  // number of items.

  if (filteredContributors.length < visibleItems && nextToken) {
    fetchMore({
      variables: { nextToken },
      updateQuery,
    });
  }

  return {
    contributors: filteredContributors.slice(0, visibleItems),
    canLoadMore: filteredContributors.length > visibleItems || !!nextToken,
    loadMore() {
      setPage((prevPage) => prevPage + 1);
    },
    loading,
  };
};

export default useColonyContributors;
