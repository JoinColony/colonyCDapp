import React from 'react';
import { defineMessages } from 'react-intl';

import ColonyActionsTable from '~common/ColonyActionsTable';
import { useSetPageBreadcrumbs } from '~context/PageHeadingContext/hooks';
import { useColonyContext, useColonySubscription, useMobile } from '~hooks';
import {
  useCreateTeamBreadcrumbs,
  useGetSelectedTeamFilter,
} from '~hooks/useTeamsBreadcrumbs';
import {
  // @BETA: Disabled for now
  // COLONY_TEAMS_ROUTE,
  COLONY_ACTIVITY_ROUTE,
  TEAM_SEARCH_PARAM,
} from '~routes';
import { formatText } from '~utils/intl';
import { setQueryParamOnUrl } from '~utils/urls';
import ColonyDashboardHeader from '~v5/common/ColonyDashboardHeader';
import Link from '~v5/shared/Link';
import Modal from '~v5/shared/Modal';

import { useDashboardHeader } from './hooks';
import Agreements from './partials/Agreements';
import Members from './partials/Members';
import Objective from './partials/Objective';
import ReputationChart from './partials/ReputationChart';
import TokenBalance from './partials/TokenBalance';
import TotalActions from './partials/TotalActions';

// @TODO: add page components
const displayName = 'common.ColonyHome';

const MSG = defineMessages({
  leaveConfimModalTitle: {
    id: `${displayName}.leaveConfimModalTitle`,
    defaultMessage: 'Are you sure you want to leave this Colony?',
  },
  leaveConfirmModalSubtitle: {
    id: `${displayName}.leaveConfirmModalSubtitle`,
    defaultMessage: `Leaving this Colony will mean you are no longer able to access the Colony during the beta period. Ensure you have a copy of the invite code available to be able to re-join again.`,
  },
  leaveConfirmModalConfirmButton: {
    id: `${displayName}.leaveConfirmModalConfirmButton`,
    defaultMessage: 'Yes, leave this Colony',
  },
});

const ColonyHome = () => {
  const isMobile = useMobile();
  const { colony } = useColonyContext();
  const selectedTeam = useGetSelectedTeamFilter();
  const teamsBreadcrumbs = useCreateTeamBreadcrumbs();

  const { leaveColonyConfirmOpen, setLeaveColonyConfirm, ...headerProps } =
    useDashboardHeader();
  const { handleUnwatch } = useColonySubscription();

  useSetPageBreadcrumbs(teamsBreadcrumbs);

  if (!colony) {
    return null;
  }

  return (
    <div className="flex flex-col gap-10">
      <ColonyDashboardHeader {...headerProps} />
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
                  selectedTeam?.nativeId.toString(),
                )}
              >
                {formatText({ id: 'view.all' })}
              </Link>
            }
          />
        </div>
      </div>
      <Modal
        title={formatText(MSG.leaveConfimModalTitle)}
        subTitle={formatText(MSG.leaveConfirmModalSubtitle)}
        isOpen={leaveColonyConfirmOpen}
        onClose={() => setLeaveColonyConfirm(false)}
        onConfirm={() => {
          setLeaveColonyConfirm(false);
          handleUnwatch();
        }}
        icon="warning-circle"
        buttonMode="primarySolid"
        confirmMessage={formatText(MSG.leaveConfirmModalConfirmButton)}
        closeMessage={formatText({
          id: 'button.cancel',
        })}
      />
    </div>
  );
};

ColonyHome.displayName = displayName;

export default ColonyHome;
