import React, { FC } from 'react';

import MembersList from '~v5/common/MembersList';
import TeamReputationSummary from '~v5/common/TeamReputationSummary';
import Header from '~frame/v5/Header';
import { useColonyContext } from '~hooks';
import { useMemberContext } from '~context/MemberContext';
import { useSetPageHeadingTitle } from '~context';
import { formatText } from '~utils/intl';
import { COLONY_CONTRIBUTORS_ROUTE, COLONY_FOLLOWERS_ROUTE } from '~routes';

const displayName = 'v5.pages.MembersPage';

const MembersPage: FC = () => {
  const {
    contributors,
    members: followers,
    loadingContributors,
    loadingMembers,
  } = useMemberContext();
  const { colony } = useColonyContext();
  const { name } = colony || {};
  const followersURL = `/${name}/${COLONY_FOLLOWERS_ROUTE}`;
  const contributorsURL = `/${name}/${COLONY_CONTRIBUTORS_ROUTE}`;

  useSetPageHeadingTitle(formatText({ id: 'membersPage.title' }));

  return (
    <div>
      <div className="relative">
        <Header title={{ id: 'members.allMembers' }} />
      </div>
      <div className="flex justify-between mt-6 gap-6 flex-col-reverse sm:flex-row md:gap-12">
        <div className="w-full">
          <MembersList
            title={{ id: 'membersPage.contributors.title' }}
            description={{ id: 'membersPage.contributors.description' }}
            emptyTitle={{ id: 'membersPage.contributors.emptyTitle' }}
            emptyDescription={{
              id: 'membersPage.contributors.emptyDescription',
            }}
            list={contributors}
            isLoading={loadingContributors}
            viewMoreUrl={contributorsURL}
            isContributorsList
          />
          <div className="mt-12">
            <MembersList
              title={{ id: 'membersPage.followers.title' }}
              description={{ id: 'membersPage.followers.description' }}
              emptyTitle={{ id: 'membersPage.followers.emptyTitle' }}
              emptyDescription={{
                id: 'membersPage.contributors.emptyDescription',
              }}
              list={followers}
              isLoading={loadingMembers}
              viewMoreUrl={followersURL}
            />
          </div>
        </div>
        <div className="sm:max-w-[14.375rem] w-full">
          <TeamReputationSummary />
        </div>
      </div>
    </div>
  );
};

MembersPage.displayName = displayName;

export default MembersPage;
