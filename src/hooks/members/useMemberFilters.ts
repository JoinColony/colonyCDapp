import { useMemo } from 'react';
import { ColonyRole, Id } from '@colony/colony-js';

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

const useMemberFilters = ({
  nativeDomainIds,
  filterPermissions,
  filterStatus,
  members,
  contributorTypes,
}: {
  members: ColonyContributor[];
  nativeDomainIds: number[];
  filterPermissions: ColonyRole[];
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
    return members.filter(({ verified }) =>
      filterStatus === StatusFilter.Verified ? verified : !verified,
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
    if (!filterPermissions.length) {
      return filteredByType;
    }

    const databaseDomainIds = new Set(
      nativeDomainIds.map((id) => `${colonyAddress}_${id}`),
    );

    // Always include the root domain, since if the user has a permission in root, they have it in all domains
    const permissionsDomainIds = new Set([
      `${colonyAddress}_${Id.RootDomain}`,
      ...databaseDomainIds,
    ]);

    return filteredByType.filter(({ roles }) => {
      const filteredRoles = roles?.items.filter(notNull) ?? [];

      // If the permissions filter is applied, there must be at least one role
      // in a selected domain for the member to be included in the results
      return filteredRoles.some(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ domainId, id, __typename, ...permissions }) =>
          permissionsDomainIds.has(domainId) &&
          hasSomeRole(permissions, filterPermissions),
      );
    });
  }, [filterPermissions, colonyAddress, filteredByType, nativeDomainIds]);

  const searchedMembers = useMemo(
    () => searchMembers(filteredByPermissions, searchValue),
    [filteredByPermissions, searchValue],
  );

  return searchedMembers;
};

export default useMemberFilters;
