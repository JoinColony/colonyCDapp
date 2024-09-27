import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import FiltersContextProvider from '~common/ColonyActionsTable/FiltersContext/FiltersContextProvider.tsx';
import RecentActivityTable from '~common/ColonyActionsTable/RecentActivityTable.tsx';
import { useMobile } from '~hooks/index.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import {
  // @BETA: Disabled for now
  // COLONY_TEAMS_ROUTE,
  COLONY_ACTIVITY_ROUTE,
  TEAM_SEARCH_PARAM,
} from '~routes/index.ts';
import { formatText } from '~utils/intl.ts';
import { setQueryParamOnUrl } from '~utils/urls.ts';
import useGetActionData from '~v5/common/ActionSidebar/hooks/useGetActionData.ts';
import Link from '~v5/shared/Link/index.ts';
import TeamFilter from '~v5/shared/TeamFilter/TeamFilter.tsx';

import DashboardHeader from './partials/DashboardHeader/index.ts';
import FundsCards from './partials/FundsCards/index.ts';
import LeaveColonyModal from './partials/LeaveColonyModal/index.ts';
import ReputationChart from './partials/ReputationChart/index.ts';
import TotalInOutBalance from './partials/TotalInOutBalance/TotalInOutBalance.tsx';

const displayName = 'v5.frame.ColonyHome';

const ColonyHome = () => {
  const isMobile = useMobile();
  const selectedDomain = useGetSelectedDomainFilter();
  const { colonyName } = useParams();
  const [selectedAction, setSelectedAction] = useState<string | undefined>(
    undefined,
  );
  const { defaultValues } = useGetActionData(selectedAction || undefined);

  return (
    <div className="flex flex-col gap-6 md:gap-4.5">
      <div className="flex flex-col gap-9 sm:gap-6">
        <DashboardHeader />
        <TeamFilter />
      </div>
      <FundsCards />
      <div className="flex h-fit w-full flex-col gap-4.5 lg:grid lg:grid-cols-3">
        <TotalInOutBalance />
        <div className="w-full sm:hidden lg:block">
          <ReputationChart />
        </div>
      </div>
      <div className="rounded-lg border border-gray-200 px-5">
        <div className="flex justify-between py-6">
          <h3 className="heading-5">
            {formatText({ id: 'dashboard.recentActivity' })}
          </h3>
          <Link
            className="text-sm font-medium text-gray-400 md:hover:text-gray-900"
            to={setQueryParamOnUrl({
              path: `/${colonyName}/${COLONY_ACTIVITY_ROUTE}`,
              params: {
                [TEAM_SEARCH_PARAM]: selectedDomain?.nativeId.toString(),
              },
            })}
          >
            {formatText({ id: 'view.all' })}
          </Link>
        </div>
        <FiltersContextProvider>
          <RecentActivityTable
            actionProps={{
              selectedAction,
              setSelectedAction,
              defaultValues,
            }}
            className="w-full [&_tr.expanded-below:not(last-child)_td>*:not(.expandable)]:!pb-2 [&_tr.expanded-below_td]:border-none [&_tr:last-child_td>*:not(.expandable)]:!py-[.9375rem] [&_tr:not(last-child)_td>*:not(.expandable)]:!pb-[.875rem] [&_tr:not(last-child)_td>*:not(.expandable)]:!pt-[.9375rem]"
            pageSize={7}
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
          />
        </FiltersContextProvider>
      </div>
      <LeaveColonyModal />
    </div>
  );
};

ColonyHome.displayName = displayName;

export default ColonyHome;
