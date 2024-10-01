import React from 'react';

import FiltersContextProvider from '~common/ColonyActionsTable/FiltersContext/FiltersContextProvider.tsx';
import RecentActivityTable from '~common/ColonyActionsTable/RecentActivityTable.tsx';
import { useMobile } from '~hooks/index.ts';
import {
  // @BETA: Disabled for now
  // COLONY_TEAMS_ROUTE,
  COLONY_ACTIVITY_ROUTE,
} from '~routes/index.ts';
import { formatText } from '~utils/intl.ts';
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

  return (
    <div className="md:gap-4.5 flex flex-col gap-6">
      <div className="flex flex-col gap-9 sm:gap-6">
        <DashboardHeader />
        <TeamFilter />
      </div>
      <FundsCards />
      <div className="gap-4.5 flex h-fit w-full flex-col lg:grid lg:grid-cols-3">
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
            to={COLONY_ACTIVITY_ROUTE}
          >
            {formatText({ id: 'view.all' })}
          </Link>
        </div>
        <FiltersContextProvider>
          <RecentActivityTable
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
