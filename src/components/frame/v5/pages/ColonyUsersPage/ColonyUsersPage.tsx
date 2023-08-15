import React, { FC } from 'react';

import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import MembersList from '~v5/common/MembersList';
import TeamReputationSummary from '~v5/common/TeamReputationSummary';
import Header from '~frame/v5/Header';
import Spinner from '~v5/shared/Spinner';
import { ColonyUsersPageProps } from './types';
import { useMemberContext } from '~context/MemberContext';

const displayName = 'v5.pages.ColonyUsersPage';

const ColonyUsersPage: FC<ColonyUsersPageProps> = ({ pageName }) => {
  const { contributors, followers, loadingAllMembers, loadingContributors } =
    useMemberContext();
  const isContributorsPage = pageName === 'contributors';
  const loading = isContributorsPage ? loadingContributors : loadingAllMembers;

  return (
    <Spinner loadingText={{ id: `loading.${pageName}Page` }}>
      <TwoColumns aside={<Navigation pageName="members" />}>
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
      </TwoColumns>
    </Spinner>
  );
};

ColonyUsersPage.displayName = displayName;

export default ColonyUsersPage;
