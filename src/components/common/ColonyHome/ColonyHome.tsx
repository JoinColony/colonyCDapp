import clsx from 'clsx';
import React from 'react';
import { defineMessages } from 'react-intl';
import { useLocation } from 'react-router-dom';

import ColonyActionsTable from '~common/ColonyActionsTable';
import { ACTION } from '~constants/actions';
import { useActionSidebarContext } from '~context';
import { useSetPageBreadcrumbs } from '~context/PageHeadingContext/hooks';
import { useColonyContext, useColonySubscription, useMobile } from '~hooks';
import {
  useCreateTeamBreadcrumbs,
  useGetSelectedTeamFilter,
} from '~hooks/useTeamsBreadcrumbs';
import {
  COLONY_MEMBERS_ROUTE,
  COLONY_DETAILS_ROUTE,
  // @BETA: Disabled for now
  // COLONY_TEAMS_ROUTE,
  COLONY_AGREEMENTS_ROUTE,
  COLONY_ACTIVITY_ROUTE,
  COLONY_BALANCES_ROUTE,
  TEAM_SEARCH_PARAM,
} from '~routes';
import Numeral from '~shared/Numeral';
import { formatText } from '~utils/intl';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { setQueryParamOnUrl } from '~utils/urls';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts';
import ColonyDashboardHeader from '~v5/common/ColonyDashboardHeader';
import DonutChart from '~v5/common/DonutChart';
import TeamReputationSummaryRow from '~v5/common/TeamReputationSummary/partials/TeamReputationSummaryRow';
import EmptyWidgetState from '~v5/common/WidgetBox/partials/EmptyWidgetState';
import WidgetBoxList from '~v5/common/WidgetBoxList';
import Link from '~v5/shared/Link';
import MessageNumber from '~v5/shared/MessageNumber';
import Modal from '~v5/shared/Modal';
import ProgressBar from '~v5/shared/ProgressBar';
import TitleWithNumber from '~v5/shared/TitleWithNumber';
import UserAvatars from '~v5/shared/UserAvatars';

import { summaryLegendColor } from './consts';
import { useDashboardHeader } from './hooks/useDashboardHeader';
import { useGetHomeWidget } from './hooks/useGetHomeWidget';

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
  const { metadata } = colony || {};
  const { objective } = metadata || {};
  const selectedTeam = useGetSelectedTeamFilter();
  const agreements = undefined;
  const {
    totalActions,
    allMembers,
    teamColor,
    currentTokenBalance,
    membersLoading,
    nativeToken,
    chartData,
    hoveredSegment,
    updateHoveredSegment,
  } = useGetHomeWidget();
  const teamsBreadcrumbs = useCreateTeamBreadcrumbs();
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  const { leaveColonyConfirmOpen, setLeaveColonyConfirm, ...headerProps } =
    useDashboardHeader();
  const { handleUnwatch } = useColonySubscription();

  useSetPageBreadcrumbs(teamsBreadcrumbs);

  const { search: searchParams } = useLocation();

  if (!colony) {
    return null;
  }

  const openSidebar = () => {
    toggleActionSidebarOn({
      [ACTION_TYPE_FIELD_NAME]: ACTION.MANAGE_COLONY_OBJECTIVES,
    });
  };

  return (
    <div className="flex flex-col gap-10">
      <ColonyDashboardHeader {...headerProps} />
      <WidgetBoxList
        items={[
          {
            key: '1',
            title: formatText({ id: 'widget.totalActions' }),
            value: <h4 className="heading-4">{totalActions}</h4>,
            className: clsx('text-base-white', {
              [teamColor]: selectedTeam,
              'bg-gray-900 border-gray-900': !selectedTeam,
            }),
            href: COLONY_ACTIVITY_ROUTE,
            searchParams,
          },
          {
            key: '2',
            title: formatText({ id: 'colonyHome.members' }),
            value: (
              <h4 className="heading-4">
                {membersLoading ? '-' : allMembers.length}
              </h4>
            ),
            href: COLONY_MEMBERS_ROUTE,
            additionalContent: (
              <UserAvatars
                maxAvatarsToShow={4}
                size="xms"
                items={allMembers}
                showRemainingAvatars={false}
              />
            ),
            searchParams,
          },
          {
            key: '3',
            title: formatText({ id: 'colonyHome.funds' }),
            value: (
              <div className="flex items-center gap-2 heading-4">
                <Numeral
                  value={currentTokenBalance}
                  decimals={getTokenDecimalsWithFallback(nativeToken?.decimals)}
                />
                <span className="text-1">{nativeToken?.symbol}</span>
              </div>
            ),
            href: COLONY_BALANCES_ROUTE,
            searchParams,
          },
        ]}
      />
      <div className="flex flex-col md:grid md:grid-cols-[39%_1fr] gap-6 w-full">
        <div className="w-full">
          <WidgetBoxList
            className="!gap-6 md:!gap-[1.125rem]"
            isVertical
            items={[
              {
                key: '1',
                title: formatText({ id: 'dashboard.objective.widget.title' }),
                titleClassName: 'uppercase text-4 text-gray-400 mb-2',
                value: objective ? (
                  <>
                    <span className="text-2 mb-1 transition-all line-clamp-1 w-full sm:hover:text-blue-400">
                      {objective.title}
                    </span>
                    <p className="text-sm text-gray-600 mb-[1.6875rem] line-clamp-2 break-word w-full">
                      {objective.description}
                    </p>
                    <ProgressBar
                      progress={objective.progress || 0}
                      additionalText="%"
                      isTall
                      barClassName={selectedTeam ? teamColor : 'bg-blue-400'}
                    />
                  </>
                ) : (
                  <EmptyWidgetState
                    title={formatText({
                      id: 'dashboard.objective.widget.noData',
                    })}
                    actionTitle={formatText({
                      id: 'dashboard.objective.widget.createObjective',
                    })}
                    className="p-[2.7rem]"
                    onClick={openSidebar}
                  />
                ),
                contentClassName: 'w-full',
                className: 'flex-col p-6 bg-base-white min-h-[11.25rem]',
                href: objective ? COLONY_DETAILS_ROUTE : undefined,
                onClick: openSidebar,
              },
              {
                key: '2',
                value: (
                  <div className="grid grid-cols-[36%_1fr] w-full gap-6">
                    <div className="relative w-full flex-shrink-0 flex justify-center items-center">
                      <div className="w-full max-w-[9.375rem]">
                        <DonutChart
                          data={chartData || []}
                          hoveredSegment={hoveredSegment}
                          updateHoveredSegment={updateHoveredSegment}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2.5 w-full">
                      <div>
                        <p className="uppercase text-4 text-gray-400">
                          {formatText({ id: 'dashboard.team.widget.title' })}
                        </p>
                        <h3 className="text-2">
                          {formatText({ id: 'dashboard.team.widget.subtitle' })}
                        </h3>
                      </div>
                      {chartData.length > 0 ? (
                        <div className="w-full">
                          <ul className="flex flex-col justify-center gap-[.6875rem]">
                            {chartData.map(({ id, label, color, value }) => (
                              <li
                                key={id}
                                className={clsx('flex items-center text-sm', {
                                  'transition-all font-semibold':
                                    hoveredSegment?.id === id,
                                })}
                              >
                                <TeamReputationSummaryRow
                                  color={
                                    summaryLegendColor[color] ||
                                    summaryLegendColor.default
                                  }
                                  name={label}
                                  totalReputation={value.toString()}
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <EmptyWidgetState
                          title={formatText({
                            id: 'dashboard.team.widget.noData',
                          })}
                          actionTitle={formatText({
                            id: 'dashboard.team.widget.createTeam',
                          })}
                          className="px-[1.8rem] py-[2.3rem]"
                          onClick={() =>
                            toggleActionSidebarOn({
                              [ACTION_TYPE_FIELD_NAME]: ACTION.CREATE_NEW_TEAM,
                            })
                          }
                        />
                      )}
                    </div>
                  </div>
                ),
                className:
                  'flex-col items-start p-6 bg-base-white min-h-[12.5rem] sm:hover:text-gray-900',
                // @BETA: Disabled for now
                // href: allTeams?.length ? COLONY_TEAMS_ROUTE : undefined,
              },
              {
                key: '3',
                title: (
                  <TitleWithNumber
                    title={formatText({
                      id: 'dashboard.agreements.widget.title',
                    })}
                    number={0}
                    className={clsx('transition-all', {
                      'sm:hover:text-blue-400': agreements,
                    })}
                  />
                ),
                titleClassName: 'text-2 mb-4',
                value: agreements ? (
                  <div className="flex flex-col gap-[.375rem]">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-3">{agreements}</span>
                      <MessageNumber message={1} />
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {agreements}
                    </p>
                  </div>
                ) : (
                  <EmptyWidgetState
                    title={formatText({
                      id: 'dashboard.agreements.widget.noData',
                    })}
                    actionTitle={formatText({
                      id: 'dashboard.agreements.widget.createObjective',
                    })}
                    className="px-[1.8rem] py-[1.2rem]"
                    onClick={() =>
                      toggleActionSidebarOn({
                        [ACTION_TYPE_FIELD_NAME]: ACTION.CREATE_DECISION,
                      })
                    }
                  />
                ),
                contentClassName: 'w-full',
                className: 'flex-col p-6 bg-base-white min-h-[11.25rem]',
                href: agreements ? COLONY_AGREEMENTS_ROUTE : undefined,
              },
            ]}
          />
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
