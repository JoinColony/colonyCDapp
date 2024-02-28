import React from 'react';

import { FiltersContextProvider } from '~common/ColonyActionsTable/FiltersContext/index.ts';
import ColonyActionsTable from '~common/ColonyActionsTable/index.ts';
import { useSetPageBreadcrumbs } from '~context/PageHeadingContext/hooks.ts';
import { useMobile } from '~hooks/index.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { useCreateTeamBreadcrumbs } from '~hooks/useTeamsBreadcrumbs.ts';
import {
  // @BETA: Disabled for now
  // COLONY_TEAMS_ROUTE,
  COLONY_ACTIVITY_ROUTE,
  TEAM_SEARCH_PARAM,
} from '~routes/index.ts';
import { formatText } from '~utils/intl.ts';
import { setQueryParamOnUrl } from '~utils/urls.ts';
import Link from '~v5/shared/Link/index.ts';

import Agreements from './partials/Agreements/index.ts';
import DashboardHeader from './partials/DashboardHeader/index.ts';
import LeaveColonyModal from './partials/LeaveColonyModal/index.ts';
import Members from './partials/Members/index.ts';
import Objective from './partials/Objective/index.ts';
import ReputationChart from './partials/ReputationChart/index.ts';
import TokenBalance from './partials/TokenBalance/index.ts';
import TotalActions from './partials/TotalActions/index.ts';

const displayName = 'v5.frame.ColonyHome';

const ColonyHome = () => {
  const isMobile = useMobile();
  const selectedDomain = useGetSelectedDomainFilter();
  const teamsBreadcrumbs = useCreateTeamBreadcrumbs();

  useSetPageBreadcrumbs(teamsBreadcrumbs);

  return (
    <div className="flex flex-col gap-6 lg:gap-10">
      <div className="flex flex-col gap-9 sm:gap-10">
        <DashboardHeader />
        <div className="flex flex-col sm:flex-row items-center gap-[1.125rem] w-full">
          <TotalActions />
          <Members />
          <TokenBalance />
        </div>
      </div>
      <div className="flex flex-col lg:grid lg:grid-cols-[39%_1fr] gap-6 w-full">
        <div className="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-col gap-6 sm:gap-[1.125rem] lg:gap-[1.125rem] w-full">
          <Objective />
          <ReputationChart />
          <Agreements />
        </div>
        <div className="w-full">
          <FiltersContextProvider>
            <ColonyActionsTable
              className="w-full [&_tr:last-child_td>*:not(.expandable)]:!py-[.9375rem] [&_tr:not(last-child)_td>*:not(.expandable)]:!pt-[.9375rem] [&_tr:not(last-child)_td>*:not(.expandable)]:!pb-[.875rem] [&_tr.expanded-below:not(last-child)_td>*:not(.expandable)]:!pb-2"
              pageSize={7}
              withHeader={false}
              state={{
                columnVisibility: isMobile
                  ? {
                      description: true,
                      motionState: true,
                      team: false,
                      createdAt: false,
                    }
                  : {
                      description: true,
                      motionState: true,
                      team: false,
                      createdAt: true,
                    },
              }}
              additionalPaginationButtonsContent={
                <Link
                  className="text-sm text-gray-700 underline"
                  to={setQueryParamOnUrl(
                    COLONY_ACTIVITY_ROUTE,
                    TEAM_SEARCH_PARAM,
                    selectedDomain?.nativeId.toString(),
                  )}
                >
                  {formatText({ id: 'view.all' })}
                </Link>
              }
            />
          </FiltersContextProvider>
        </div>
      </div>
      <LeaveColonyModal />
    </div>
  );
};

ColonyHome.displayName = displayName;

export default ColonyHome;
