import React, { FC } from 'react';

import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import MembersList from '~v5/common/MembersList';
import TeamReputationSummary from '~v5/common/TeamReputationSummary';
import { teamsWithSummedUpData } from '~v5/common/TeamReputationSummary/consts';
import { useSearchContext } from '~context/SearchContext';
import { useMembersPage } from '../MembersPage/hooks';
import Header from '~frame/v5/Header';

const FollowersPage: FC = () => {
  const { searchValue } = useSearchContext();
  const { followers, loading } = useMembersPage(searchValue);

  return (
    <TwoColumns aside={<Navigation pageName="members" />}>
      <Header title={{ id: 'membersPage.followers.allMembers' }} />
      <div className="flex justify-between mt-6 gap-6 flex-col-reverse sm:flex-row md:gap-12">
        <div className="w-full">
          <MembersList
            title={{ id: 'membersPage.followers.title' }}
            description={{ id: 'membersPage.followers.description' }}
            emptyTitle={{ id: 'membersPage.followers.emptyTitle' }}
            emptyDescription={{
              id: 'membersPage.followers.emptyDescription',
            }}
            list={followers}
            isLoading={loading}
            isHomePage={false}
          />
        </div>
        {/* @TODO: Add real data */}
        <div className="sm:max-w-[14.375rem] w-full">
          <TeamReputationSummary teams={teamsWithSummedUpData} />
        </div>
      </div>
    </TwoColumns>
  );
};

export default FollowersPage;
