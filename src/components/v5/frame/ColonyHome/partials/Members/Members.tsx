import React from 'react';
import { useLocation } from 'react-router-dom';

import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { COLONY_MEMBERS_ROUTE } from '~routes/index.ts';
import { formatText } from '~utils/intl.ts';
import WidgetBox from '~v5/common/WidgetBox/index.ts';
import UserAvatars from '~v5/shared/UserAvatars/index.ts';

const displayName = 'v5.frame.ColonyHome.Members';

const Members = () => {
  const { search } = useLocation();

  const selectedDomain = useGetSelectedDomainFilter();
  const nativeDomainId = selectedDomain?.nativeId;
  const {
    totalMembers: members,
    totalMemberCount,
    loading: membersLoading,
  } = useMemberContext();

  const domainMembers = nativeDomainId
    ? members.filter(
        ({ roles, reputation }) =>
          roles?.items?.find(
            (role) => role?.domain.nativeId === nativeDomainId,
          ) ||
          reputation?.items?.find(
            (rep) => rep?.domain.nativeId === nativeDomainId,
          ),
      )
    : members;

  const allMembers = domainMembers.map((member) => ({
    walletAddress: member.contributorAddress,
    ...member.user,
  }));

  // Either all or just filtered by domain
  const membersCount = !nativeDomainId ? totalMemberCount : allMembers.length;

  return (
    <WidgetBox
      title={formatText({ id: 'colonyHome.members' })}
      value={
        <h4 className="heading-4">{membersLoading ? '-' : membersCount}</h4>
      }
      href={COLONY_MEMBERS_ROUTE}
      additionalContent={
        <UserAvatars
          maxAvatarsToShow={4}
          size={38}
          withThickerBorder
          items={allMembers}
          showRemainingAvatars={false}
        />
      }
      searchParams={search}
      className="border-base-bg bg-base-bg"
    />
  );
};

Members.displayName = displayName;
export default Members;
