import React, { useState } from 'react';

import FiltersContextProvider from '~common/ColonyActionsTable/FiltersContext/FiltersContextProvider.tsx';
import RecentActivityTable from '~common/ColonyActionsTable/RecentActivityTable.tsx';
import { TourTargets } from '~common/Tours/enums.ts';
import {
  // @BETA: Disabled for now
  // COLONY_TEAMS_ROUTE,
  COLONY_ACTIVITY_ROUTE,
} from '~routes/index.ts';
import { formatText } from '~utils/intl.ts';
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
  const [selectedAction, setSelectedAction] = useState<string | undefined>(
    undefined,
  );
  const { defaultValues } = useGetActionData(selectedAction || undefined);

  return (
    <div
      className="flex flex-grow flex-col gap-6 sm:min-h-full md:gap-4.5"
      data-tour={TourTargets.Dashboard}
    >
      <div className="flex flex-col gap-8 sm:gap-6">
        <DashboardHeader />
        <TeamFilter />
      </div>
      <FundsCards />
      <div className="flex h-fit w-full flex-col gap-4.5 lg:grid lg:grid-cols-3">
        <TotalInOutBalance />
        <div className="w-full sm:hidden lg:flex">
          <ReputationChart />
        </div>
      </div>
      <div className="flex flex-grow flex-col rounded-lg border border-gray-200 pb-[1.4375rem] sm:max-h-[37.625rem]">
        <div className="flex justify-between px-5 pb-[11px] pt-6">
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
            actionProps={{
              selectedAction,
              setSelectedAction,
              defaultValues,
            }}
            className="flex w-full flex-grow flex-col justify-between [&_tr.expanded-below:not(last-child)_td>*:not(.expandable)]:!pb-2 [&_tr.expanded-below_td]:border-none [&_tr:last-child_td>*:not(.expandable)]:!py-[13px] [&_tr:not(last-child)_td>*:not(.expandable)]:!pb-[13px] [&_tr:not(last-child)_td>*:not(.expandable)]:!pt-[13px]"
            pageSize={7}
          />
        </FiltersContextProvider>
      </div>
      <LeaveColonyModal />
    </div>
  );
};

ColonyHome.displayName = displayName;

export default ColonyHome;
