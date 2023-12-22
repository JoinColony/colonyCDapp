import { Id } from '@colony/colony-js';
import { useMemo } from 'react';

import { UserRole } from '~constants/permissions';
import { useSearchContext } from '~context/SearchContext';
import { useColonyContext } from '~hooks';
import { useGetSelectedTeamFilter } from '~hooks/useTeamsBreadcrumbs';
import { ColonyContributor } from '~types';
import { notNull } from '~utils/arrays';
import { searchMembers } from '~utils/members';
import {
  ContributorTypeFilter,
  StatusFilter,
  StatusType,
} from '~v5/common/TableFiltering/types';

import { hasSomeRole } from './utils';

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
  const { colony } = useColonyContext();
  const { searchValue } = useSearchContext();
  const selectedTeam = useGetSelectedTeamFilter();

  const { colonyAddress = '' } = colony ?? {};

  const databaseDomainIds = useMemo(
    () =>
      new Set(
        selectedTeam
          ? [selectedTeam.id]
          : nativeDomainIds.map((id) => `${colonyAddress}_${id}`),
      ),
    [nativeDomainIds, colonyAddress, selectedTeam],
  );

  // Always include the root domain, since if the user has a permission in root, they have it in all domains
  const permissionsDomainIds = useMemo(
    () => new Set([`${colonyAddress}_${Id.RootDomain}`, ...databaseDomainIds]),
    [databaseDomainIds, colonyAddress],
  );

  const filteredByTeam = useMemo(() => {
    if (!selectedTeam) {
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
  }, [members, databaseDomainIds, permissionsDomainIds, selectedTeam]);

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
          hasSomeRole(
            rest,
            Object.keys(filterPermissions).length
              ? filterPermissions
              : undefined,
          ),
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
