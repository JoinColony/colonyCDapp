import { useMemo } from 'react';
import { Id } from '@colony/colony-js';

import { hasSomeRole } from './utils';
import {
  ContributorTypeFilter,
  StatusFilter,
  StatusType,
} from '~v5/common/TableFiltering/types';
import { useColonyContext } from '~hooks';
import { searchMembers } from '~utils/members';
import { useSearchContext } from '~context/SearchContext';
import { ColonyContributor } from '~types';
import { notNull } from '~utils/arrays';
import { UserRole } from '~constants/permissions';

const useMemberFilters = ({
  nativeDomainIds,
  filterPermissions,
  filterStatus,
  members,
  isContributorList = false,
  contributorTypes,
}: {
  members: ColonyContributor[];
  nativeDomainIds: number[];
  filterPermissions: Record<UserRole, number[]>;
  isContributorList?: boolean;
  contributorTypes: Set<ContributorTypeFilter>;
  filterStatus?: StatusType;
}) => {
  const { colony } = useColonyContext();
  const { searchValue } = useSearchContext();
  const { colonyAddress = '' } = colony ?? {};

  const filteredByStatus = useMemo(() => {
    if (!filterStatus) {
      return members;
    }
    return members.filter(({ isVerified }) =>
      filterStatus === StatusFilter.Verified ? isVerified : !isVerified,
    );
  }, [filterStatus, members]);

  const filteredByType = useMemo(() => {
    if (!contributorTypes.size) {
      return filteredByStatus;
    }

    return filteredByStatus.filter(({ type }) => {
      if (!type) {
        return false;
      }

      return contributorTypes.has(type.toLowerCase() as ContributorTypeFilter);
    });
  }, [filteredByStatus, contributorTypes]);

  const filteredByPermissions = useMemo(() => {
    const databaseDomainIds = new Set(
      nativeDomainIds.map((id) => `${colonyAddress}_${id}`),
    );

    // Always include the root domain, since if the user has a permission in root, they have it in all domains
    const permissionsDomainIds = new Set([
      `${colonyAddress}_${Id.RootDomain}`,
      ...databaseDomainIds,
    ]);

    if (!Object.keys(filterPermissions).length) {
      if (!isContributorList) {
        // Don't filter allMembers list by domain selected.
        return filteredByType;
      }

      return (
        filteredByType?.filter(notNull).filter(({ roles, reputation }) => {
          const filteredRoles = roles?.items.filter(notNull) ?? [];
          const filteredReputation = reputation?.items.filter(notNull) ?? [];
          // Filter contributors list by whether there's some rep in the selected domains
          // or some permissions in the selected domains
          return (
            filteredReputation.some(({ domainId }) =>
              databaseDomainIds.has(domainId),
            ) ||
            filteredRoles.some(
              ({ domainId, ...rest }) =>
                permissionsDomainIds.has(domainId) &&
                hasSomeRole(rest, undefined),
            )
          );
        }) ?? []
      );
    }

    return filteredByType.filter(({ roles }) => {
      const filteredRoles = roles?.items.filter(notNull) ?? [];

      // If the permissions filter is applied, there must be at least one role
      // in a selected domain for the member to be included in the results
      return filteredRoles.some(
        ({ domainId, ...rest }) =>
          permissionsDomainIds.has(domainId) &&
          hasSomeRole(rest, filterPermissions),
      );
    });
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(filterPermissions),
    filterPermissions,
    colonyAddress,
    filteredByType,
    nativeDomainIds,
    isContributorList,
  ]);

  const searchedMembers = useMemo(
    () => searchMembers(filteredByPermissions, searchValue),
    [filteredByPermissions, searchValue],
  );

  return searchedMembers;
};

export default useMemberFilters;
