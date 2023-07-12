import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';

import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import BurgerMenu from '~v5/shared/BurgerMenu';
import PopoverBase from '~v5/shared/PopoverBase';
import SubNavigation from './partials/SubNavigation';
import { useMembersPage } from './hooks';
import ManageMemberModal from '~v5/common/Modals/ManageMemberModal';
import Filter from '~v5/common/Filter';
import MembersList from '~v5/common/MembersList';
import TeamReputationSummary from '~v5/common/TeamReputationSummary';
import { teamsWithSummedUpData } from '~v5/common/TeamReputationSummary/consts';
import { useSearchContext } from '~context/SearchContext';

const MembersPage: FC = () => {
  const [isManageMembersOpen, setIsManageMembersOpen] = useState(false);
  const { searchValue } = useSearchContext();
  const {
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
    contributors,
    followers,
    loading,
    followersURL,
    contributorsURL,
  } = useMembersPage(searchValue);
  const { formatMessage } = useIntl();

  return (
    <TwoColumns aside={<Navigation pageName="members" />}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h4 className="heading-4 mr-2">
            {formatMessage({ id: 'members.allMembers' })}
          </h4>
          <BurgerMenu isVertical setTriggerRef={setTriggerRef} />
          {visible && (
            <PopoverBase
              setTooltipRef={setTooltipRef}
              tooltipProps={getTooltipProps}
              withTooltipStyles={false}
              cardProps={{
                rounded: 's',
                hasShadow: true,
                className: 'py-4 px-2',
              }}
              classNames="w-full sm:max-w-[17.375rem]"
            >
              <SubNavigation
                onManageMembersClick={() => setIsManageMembersOpen(true)}
              />
            </PopoverBase>
          )}
        </div>
        <Filter />
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
        {/* @TODO: Add real data */}
        <div className="sm:max-w-[14.375rem] w-full">
          <TeamReputationSummary teams={teamsWithSummedUpData} />
        </div>
      </div>
      <ManageMemberModal
        isOpen={isManageMembersOpen}
        onClose={() => setIsManageMembersOpen(false)}
      />
    </TwoColumns>
  );
};

export default MembersPage;
