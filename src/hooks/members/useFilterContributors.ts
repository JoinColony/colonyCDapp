import { useMemo } from 'react';
import { ColonyRole } from '@colony/colony-js';
import Decimal from 'decimal.js';

import { intersectContributors } from './utils';
import {
  ContributorTypeFilter,
  StatusFilter,
  StatusType,
} from '~v5/common/TableFiltering/types';
import { SortingMethod } from '~gql';
import { useColonyContext } from '~hooks';
import { searchMembers } from '~utils/members';
import { useSearchContext } from '~context/SearchContext';
import { ContributorWithReputation } from '~types';

const filterContributorByStatus = (
  members: ContributorWithReputation[],
  whitelistedAddresses: string[],
  statusFilter?: StatusType,
) => {
  if (!statusFilter) {
    return members;
  }

  const whitelist = new Set(whitelistedAddresses);

  return members.filter(({ address }) =>
    statusFilter === StatusFilter.verified
      ? whitelist.has(address)
      : !whitelist.has(address),
  );
};

const sortContributors = (
  filterDomains: number[],
  contributors: ContributorWithReputation[],
  sortingMethod?: SortingMethod,
) => {
  if (filterDomains.length === 1) {
    if (sortingMethod === SortingMethod.ByLowestRep) {
      return contributors.sort((a, b) =>
        new Decimal(a.domainReputationPercentage)
          .sub(b.domainReputationPercentage)
          .toNumber(),
      );
    }

    return contributors.sort((a, b) =>
      new Decimal(b.domainReputationPercentage)
        .sub(a.domainReputationPercentage)
        .toNumber(),
    );
  }

  if (sortingMethod === SortingMethod.ByLowestRep) {
    return contributors.sort((a, b) =>
      new Decimal(a.colonyReputationPercentage)
        .sub(b.colonyReputationPercentage)
        .toNumber(),
    );
  }

  return contributors.sort((a, b) =>
    new Decimal(b.colonyReputationPercentage)
      .sub(a.colonyReputationPercentage)
      .toNumber(),
  );
};

const useFilterContributors = ({
  nativeDomainIds,
  permissions,
  filterStatus,
  contributorTypes,
  sortingMethod,
  contributors,
  limit,
}: {
  nativeDomainIds: number[];
  permissions: ColonyRole[];
  contributorTypes: ContributorTypeFilter[];
  filterStatus?: StatusType;
  sortingMethod?: SortingMethod;
  limit: number;
  contributors: {
    contributorsWithReputation: ContributorWithReputation[];
    permissionedContributors: ContributorWithReputation[];
    [k: string]: ContributorWithReputation[];
  };
}) => {
  const { colony } = useColonyContext();
  const { metadata } = colony ?? {};
  const { searchValue } = useSearchContext();

  const filteredContributors = useMemo(
    () =>
      intersectContributors({
        contributors,
        permissions,
        contributorTypes,
      }),
    [contributors, permissions, contributorTypes],
  );

  const statusFilteredContributors = useMemo(() => {
    return filterContributorByStatus(
      filteredContributors,
      metadata?.whitelistedAddresses ?? [],
      filterStatus,
    );
  }, [filteredContributors, filterStatus, metadata]);

  const sortedContributors = useMemo(
    () =>
      sortContributors(
        nativeDomainIds,
        statusFilteredContributors,
        sortingMethod,
      ),
    [sortingMethod, statusFilteredContributors, nativeDomainIds],
  );

  const searchedContributors = useMemo(
    () => searchMembers(sortedContributors, searchValue),
    [sortedContributors, searchValue],
  );

  return {
    filteredContributors: searchedContributors.slice(0, limit),
    canFetchMore: searchedContributors.length > limit,
  };
};

export default useFilterContributors;
