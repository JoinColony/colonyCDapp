import React from 'react';

import ColonyActionsTable from '~common/ColonyActionsTable';
import { useSetPageBreadcrumbs } from '~context/PageHeadingContext/hooks';
import { useMobile } from '~hooks';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter';
import { useCreateTeamBreadcrumbs } from '~hooks/useTeamsBreadcrumbs';
import {
  // @BETA: Disabled for now
  // COLONY_TEAMS_ROUTE,
  COLONY_ACTIVITY_ROUTE,
  TEAM_SEARCH_PARAM,
} from '~routes';
import { formatText } from '~utils/intl';
import { setQueryParamOnUrl } from '~utils/urls';
import Link from '~v5/shared/Link';

import Agreements from './partials/Agreements';
import DashboardHeader from './partials/DashboardHeader';
import LeaveColonyModal from './partials/LeaveColonyModal';
import Members from './partials/Members';
import Objective from './partials/Objective';
import ReputationChart from './partials/ReputationChart';
import TokenBalance from './partials/TokenBalance';
import TotalActions from './partials/TotalActions';

const displayName = 'v5.frame.ColonyHome';

const ColonyHome = () => {
  const isMobile = useMobile();
  const selectedDomain = useGetSelectedDomainFilter();
  const teamsBreadcrumbs = useCreateTeamBreadcrumbs();

  useSetPageBreadcrumbs(teamsBreadcrumbs);

  return (
    <div className="flex flex-col gap-10">
      <DashboardHeader />
      <div className="flex flex-col sm:flex-row items-center gap-[1.125rem] w-full">
        <TotalActions />
        <Members />
        <TokenBalance />
      </div>
      <div className="flex flex-col md:grid md:grid-cols-[39%_1fr] gap-6 w-full">
        <div className="flex flex-col items-center gap-6 md:gap-[1.125rem] w-full">
          <Objective />
          <ReputationChart />
          <Agreements />
        </div>
        <div className="w-full">
          <ColonyActionsTable
            className="w-full [&_tr:last-child_td>*]:!py-[.9375rem] [&_tr:not(last-child)_td>*]:!pt-[.9375rem] [&_tr:not(last-child)_td>*]:!pb-[.875rem]"
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
        </div>
      </div>
      <LeaveColonyModal />
    </div>
  );
};

ColonyHome.displayName = displayName;

export default ColonyHome;
