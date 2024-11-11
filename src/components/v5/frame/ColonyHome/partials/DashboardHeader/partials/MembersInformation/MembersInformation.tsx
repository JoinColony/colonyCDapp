import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import { COLONY_FOLLOWERS_ROUTE, COLONY_MEMBERS_ROUTE } from '~routes/index.ts';
import { formatText } from '~utils/intl.ts';
import UserAvatars from '~v5/shared/UserAvatars/index.ts';

const displayName =
  'v5.common.ColonyDashboardHeader.partials.MembersInformation';

const MembersInformation = () => {
  const { search } = useLocation();

  const {
    loading: membersLoading,
    totalContributors,
    totalContributorCount,
    totalMemberCount,
  } = useMemberContext();

  const allMembers = totalContributors.map((member) => ({
    walletAddress: member.contributorAddress,
    ...member.user,
  }));

  return (
    <div className="flex items-center gap-3.5 pl-2 text-sm">
      <Link
        className="flex items-center gap-3.5 md:hover:text-blue-400"
        to={{ pathname: COLONY_MEMBERS_ROUTE, search: search || '' }}
      >
        <UserAvatars
          maxAvatarsToShow={4}
          size={24}
          items={allMembers}
          showRemainingAvatars={false}
          isLoading={membersLoading}
        />
        <LoadingSkeleton
          isLoading={membersLoading}
          className="h-4 w-[70px] rounded"
        >
          <p>
            {/* What the UI calls members, the context calls contributors */}
            <span className="font-semibold">{totalContributorCount}</span>{' '}
            {formatText({ id: 'colonyHome.members' })}
          </p>
        </LoadingSkeleton>
      </Link>
      <Link
        className="md:hover:text-blue-400"
        to={{ pathname: COLONY_FOLLOWERS_ROUTE, search: search || '' }}
      >
        <LoadingSkeleton
          isLoading={membersLoading}
          className="h-4 w-[70px] rounded"
        >
          <p>
            {/* What the UI calls followers, the context calls members */}
            <span className="font-semibold">{totalMemberCount}</span>{' '}
            {formatText({ id: 'colonyHome.followers' })}
          </p>
        </LoadingSkeleton>
      </Link>
    </div>
  );
};

MembersInformation.displayName = displayName;

export default MembersInformation;
