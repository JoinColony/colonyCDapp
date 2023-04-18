import React from 'react';

import { MemberType } from '~common/ColonyMembers/MembersFilter/filtersConfig';
import { Watcher, Contributor } from '~types';

import ContributorsSection from './ContributorsSection';
import WatchersSection from './WatchersSection';

const displayName = 'common.Members.MembersContent';

interface Props {
  filters: any;
  watchers: Watcher[];
  contributors: Contributor[];
  isRootOrAllDomains: boolean;
}

const MembersContent = ({ filters, watchers, contributors, isRootOrAllDomains }: Props) => {
  const showContributors = filters.memberType === MemberType.All || filters.memberType === MemberType.Contributers;
  const showWatchers = filters.memberType === MemberType.All || filters.memberType === MemberType.Watchers;
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
      {isRootOrAllDomains && showWatchers ? (
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
