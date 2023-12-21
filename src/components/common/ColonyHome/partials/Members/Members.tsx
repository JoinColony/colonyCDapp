import React from 'react';
import { useLocation } from 'react-router-dom';
import { useMemberContext } from '~context/MemberContext';
import { useGetSelectedTeamFilter } from '~hooks/useTeamsBreadcrumbs';
import { COLONY_MEMBERS_ROUTE } from '~routes';
import { formatText } from '~utils/intl';
import WidgetBox from '~v5/common/WidgetBox';
import UserAvatars from '~v5/shared/UserAvatars';

const displayName = 'common.ColonyHome.Members';

const Members = () => {
  const { search } = useLocation();

  const selectedTeam = useGetSelectedTeamFilter();
  const nativeTeamId = selectedTeam?.nativeId;
  const { totalMembers: members, loading: membersLoading } = useMemberContext();

  const domainMembers = nativeTeamId
    ? members.filter(
        ({ roles, reputation }) =>
          roles?.items?.find(
            (role) => role?.domain.nativeId === nativeTeamId,
          ) ||
          reputation?.items?.find(
            (rep) => rep?.domain.nativeId === nativeTeamId,
          ),
      )
    : members;

  const allMembers = domainMembers
    .filter(
      (member, index, self) =>
        index ===
        self.findIndex(
          (m) => m.contributorAddress === member.contributorAddress,
        ),
    )
    .map((member) => ({
      walletAddress: member.contributorAddress,
      ...member.user,
    }))
    .sort(() => Math.random() - 0.5);

  return (
    <WidgetBox
      title={formatText({ id: 'colonyHome.members' })}
      value={
        <h4 className="heading-4">
          {membersLoading ? '-' : allMembers.length}
        </h4>
      }
      href={COLONY_MEMBERS_ROUTE}
      additionalContent={
        <UserAvatars
          maxAvatarsToShow={4}
          size="xms"
          items={allMembers}
          showRemainingAvatars={false}
        />
      }
      searchParams={search}
    />
  );
};

Members.displayName = displayName;
export default Members;
