import { Id } from '@colony/colony-js';
import { useMemo } from 'react';

import { type UserRole } from '~constants/permissions.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useSearchContext } from '~context/SearchContext/SearchContext.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { type ColonyContributor } from '~types/graphql.ts';
import { notNull } from '~utils/arrays/index.ts';
import { getDomainDatabaseId } from '~utils/databaseId.ts';
import { searchMembers } from '~utils/members.ts';
import {
  type ContributorTypeFilter,
  StatusFilter,
  type StatusType,
} from '~v5/common/TableFiltering/types.ts';

import { hasSomeRole } from './utils.ts';

const useMemberFilters = ({
  nativeDomainIds,
  filterPermissions,
  filterStatus,
  members,
  contributorTypes,
}: {
  members: ColonyContributor[];
  nativeDomainIds: number[];
  filterPermissions: Record<UserRole, number[]>;
  contributorTypes: Set<ContributorTypeFilter>;
  filterStatus?: StatusType;
}) => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const { searchValue } = useSearchContext();
  const selectedDomain = useGetSelectedDomainFilter();

  const databaseDomainIds = useMemo(
    () =>
      new Set(
        selectedDomain
          ? [selectedDomain.id]
          : nativeDomainIds.map((id) => getDomainDatabaseId(colonyAddress, id)),
      ),
    [nativeDomainIds, colonyAddress, selectedDomain],
  );

  // Always include the root domain, since if the user has a permission in root, they have it in all domains
  const permissionsDomainIds = useMemo(
    () =>
      new Set([
        getDomainDatabaseId(colonyAddress, Id.RootDomain),
        ...databaseDomainIds,
      ]),
    [databaseDomainIds, colonyAddress],
  );

  const filteredByTeam = useMemo(() => {
    if (!selectedDomain) {
      return members;
    }

    return (
      members.filter(({ roles, reputation }) => {
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
  }, [members, databaseDomainIds, permissionsDomainIds, selectedDomain]);

  const filteredByStatus = useMemo(() => {
    if (!filterStatus) {
      return filteredByTeam;
    }
    return filteredByTeam.filter(({ isVerified }) =>
      filterStatus === StatusFilter.Verified ? isVerified : !isVerified,
    );
  }, [filterStatus, filteredByTeam]);

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
    if (!Object.keys(filterPermissions).length) {
      return filteredByType;
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
  }, [filteredByType, filterPermissions, permissionsDomainIds]);

  const searchedMembers = useMemo(
    () => searchMembers(filteredByPermissions, searchValue),
    [filteredByPermissions, searchValue],
  );

  return searchedMembers;
};

export default useMemberFilters;
