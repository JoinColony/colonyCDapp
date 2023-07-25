import React, { FC } from 'react';

import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import { useMembersPage } from './hooks';
import MembersList from '~v5/common/MembersList';
import TeamReputationSummary from '~v5/common/TeamReputationSummary';
import { useSearchContext } from '~context/SearchContext';
import Header from '~frame/v5/Header';
import Spinner from '~v5/shared/Spinner';

const displayName = 'v5.pages.MembersPage';

const MembersPage: FC = () => {
  const { searchValue } = useSearchContext();
  const { contributors, followers, loading, followersURL, contributorsURL } =
    useMembersPage(searchValue);

  return (
    <Spinner loadingText={{ id: 'loading.membersPage' }}>
      <TwoColumns aside={<Navigation pageName="members" />}>
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
              isLoading={loading}
              viewMoreUrl={contributorsURL}
              isContributorsList
              isHomePage
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
                isLoading={loading}
                viewMoreUrl={followersURL}
                isHomePage
              />
            </div>
          </div>
          <div className="sm:max-w-[14.375rem] w-full">
            <TeamReputationSummary />
          </div>
        </div>
      </TwoColumns>
    </Spinner>
  );
};

MembersPage.displayName = displayName;

export default MembersPage;
