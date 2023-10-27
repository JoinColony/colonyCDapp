import React, { FC } from 'react';

import MembersList from '~v5/common/MembersList';
import TeamReputationSummary from '~v5/common/TeamReputationSummary';
import Header from '~frame/v5/Header';
import { ColonyUsersPageProps } from './types';
import { useMemberContext } from '~context/MemberContext';

const displayName = 'v5.pages.ColonyUsersPage';

const ColonyUsersPage: FC<ColonyUsersPageProps> = ({ pageName }) => {
  const {
    contributors,
    members: followers,
    loadingMembers,
    loadingContributors,
  } = useMemberContext();
  const isContributorsPage = pageName === 'contributors';
  const loading = isContributorsPage ? loadingContributors : loadingMembers;

  return (
    <div>
      <div className="relative">
        <Header title={{ id: `membersPage.${pageName}.allMembers` }} />
      </div>
      <div className="flex justify-between mt-6 gap-6 flex-col-reverse sm:flex-row md:gap-12">
        <div className="w-full">
          <MembersList
            title={{ id: `membersPage.${pageName}.title` }}
            description={{ id: `membersPage.${pageName}.description` }}
            emptyTitle={{ id: `membersPage.${pageName}.emptyTitle` }}
            emptyDescription={{
              id: `membersPage.${pageName}.emptyDescription`,
            }}
            list={isContributorsPage ? contributors : followers}
            isContributorsList={isContributorsPage}
            isLoading={loading}
          />
        </div>
        {/* @TODO: Add real data */}
        <div className="sm:max-w-[14.375rem] w-full">
          <TeamReputationSummary />
        </div>
      </div>
    </div>
  );
};

ColonyUsersPage.displayName = displayName;

export default ColonyUsersPage;
