import React, { useMemo } from 'react';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID, ROOT_DOMAIN_ID } from '~constants';
import {
  // FormValues as FiltersFormValues,
  MemberType,
} from '~common/ColonyMembers/MembersFilter/filtersConfig';
import { Watcher, Contributor } from '~types';

import ContributorsSection from './ContributorsSection';
import WatchersSection from './WatchersSection';

const displayName = 'common.Members.MembersContent';

interface Props {
  selectedDomain: number | undefined;
  filters: any;
  // filters: FiltersFormValues;
  watchers: Watcher[];
  contributors: Contributor[];
}

const MembersContent = ({
  selectedDomain,
  filters,
  watchers,
  contributors,
}: Props) => {
  const isRootDomain = useMemo(
    () =>
      selectedDomain === ROOT_DOMAIN_ID ||
      selectedDomain === COLONY_TOTAL_BALANCE_DOMAIN_ID,
    [selectedDomain],
  );

  const contributorsContent = (filters.memberType === MemberType.All ||
    filters.memberType === MemberType.Contributers) && (
    <ContributorsSection
      contributors={contributors}
      // temporary value until permissions are implemented
      // extraItemContent={({ roles, directRoles, banned }) => {
      //   return (
      //     <UserPermissions
      //       roles={roles}
      //       directRoles={directRoles}
      //       banned={banned}
      //       hideHeadRole
      //     />
      //   );
      // }}
    />
  );

  const watchersContent =
    isRootDomain &&
    (filters.memberType === MemberType.All ||
      filters.memberType === MemberType.Watchers) ? (
      <WatchersSection
        watchers={watchers}
        // temporary value until permissions are implemented
        // extraItemContent={({ banned }) => (
        //   <UserPermissions roles={[]} directRoles={[]} banned={banned} />
        // )}
      />
    ) : null;

  return (
    <>
      {contributorsContent}
      {watchersContent}
    </>
  );
};

MembersContent.displayName = displayName;

export default MembersContent;
