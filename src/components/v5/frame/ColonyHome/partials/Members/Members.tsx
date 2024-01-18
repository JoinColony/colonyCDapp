import React from 'react';
import { useLocation } from 'react-router-dom';

import { useMemberContext } from '~context/MemberContext';
import { useGetSelectedDomainFilter } from '~hooks';
import { COLONY_MEMBERS_ROUTE } from '~routes';
import { formatText } from '~utils/intl';
import WidgetBox from '~v5/common/WidgetBox';
import UserAvatars from '~v5/shared/UserAvatars';

const displayName = 'v5.frame.ColonyHome.Members';

const Members = () => {
  const { search } = useLocation();

  const selectedDomain = useGetSelectedDomainFilter();
  const nativeDomainId = selectedDomain?.nativeId;
  const { totalMembers: members, loading: membersLoading } = useMemberContext();

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
          withThickerBorder
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
