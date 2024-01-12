import React from 'react';
import { defineMessages } from 'react-intl';

import ColonyActionsTable from '~common/ColonyActionsTable';
import { useColonyDashboardContext } from '~context/ColonyDashboardContext';
import { useSetPageBreadcrumbs } from '~context/PageHeadingContext/hooks';
import {
  useColonySubscription,
  useGetSelectedDomainFilter,
  useMobile,
} from '~hooks';
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
import Modal from '~v5/shared/Modal';

import Agreements from './partials/Agreements';
import DashboardHeader from './partials/DashboardHeader';
import Members from './partials/Members';
import Objective from './partials/Objective';
import ReputationChart from './partials/ReputationChart';
import TokenBalance from './partials/TokenBalance';
import TotalActions from './partials/TotalActions';

const displayName = 'v5.frame.ColonyHome';

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
  const selectedDomain = useGetSelectedDomainFilter();
  const teamsBreadcrumbs = useCreateTeamBreadcrumbs();

  const { isLeaveColonyModalOpen, closeLeaveColonyModal } =
    useColonyDashboardContext();
  const { handleUnwatch } = useColonySubscription();

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
      <Modal
        title={formatText(MSG.leaveConfimModalTitle)}
        subTitle={formatText(MSG.leaveConfirmModalSubtitle)}
        isOpen={isLeaveColonyModalOpen}
        onClose={() => closeLeaveColonyModal()}
        onConfirm={() => {
          closeLeaveColonyModal();
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
