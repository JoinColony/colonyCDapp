import React from 'react';

import FiltersContextProvider from '~common/ColonyActionsTable/FiltersContext/FiltersContextProvider.tsx';
import ColonyActionsTable from '~common/ColonyActionsTable/index.ts';
import { useSetPageBreadcrumbs } from '~context/PageHeadingContext/PageHeadingContext.ts';
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

import DashboardHeader from './partials/DashboardHeader/index.ts';
import FundsCards from './partials/FundsCards/index.ts';
import LeaveColonyModal from './partials/LeaveColonyModal/index.ts';
import ReputationChart from './partials/ReputationChart/index.ts';
import TokenBalance from './partials/TokenBalance/index.ts';

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
        <div className="flex w-full flex-col items-center gap-[1.125rem] sm:flex-row">
          <TokenBalance />
        </div>
      </div>
      <FundsCards />
      <div className="flex h-fit w-full flex-col gap-6 lg:grid lg:grid-cols-[39%_1fr]">
        <div className="flex w-full flex-1 flex-col gap-6 sm:grid sm:grid-cols-2 sm:gap-[1.125rem] lg:flex lg:flex-col lg:gap-[1.125rem]">
          <ReputationChart />
        </div>
        <div className="w-full">
          <FiltersContextProvider>
            <ColonyActionsTable
              className="w-full [&_tr.expanded-below:not(last-child)_td>*:not(.expandable)]:!pb-2 [&_tr.expanded-below_td]:border-none [&_tr:last-child_td>*:not(.expandable)]:!py-[.9375rem] [&_tr:not(last-child)_td>*:not(.expandable)]:!pb-[.875rem] [&_tr:not(last-child)_td>*:not(.expandable)]:!pt-[.9375rem]"
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
