import React from 'react';

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
  const isRootDomain =
    selectedDomain === ROOT_DOMAIN_ID ||
    selectedDomain === COLONY_TOTAL_BALANCE_DOMAIN_ID;
  const showContributors =
    filters.memberType === MemberType.All ||
    filters.memberType === MemberType.Contributers;
  const showWatchers =
    filters.memberType === MemberType.All ||
    filters.memberType === MemberType.Watchers;
  return (
    <>
      {showContributors && (
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
      )}
      {isRootDomain && showWatchers ? (
        <WatchersSection
          watchers={watchers}
          // temporary value until permissions are implemented
          // extraItemContent={({ banned }) => (
          //   <UserPermissions roles={[]} directRoles={[]} banned={banned} />
          // )}
        />
      ) : null}
    </>
  );
};

MembersContent.displayName = displayName;

export default MembersContent;
