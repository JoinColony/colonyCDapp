import React from 'react';
import clsx from 'clsx';
import { useColonyContext } from '~hooks';
import {
  useSetPageBreadcrumbs,
  useSetPageHeadingTitle,
} from '~context/PageHeadingContext/hooks';
import { formatText } from '~utils/intl';
import {
  COLONY_MEMBERS_ROUTE,
  COLONY_DETAILS_ROUTE,
  COLONY_TEAMS_ROUTE,
  COLONY_AGREEMENTS_ROUTE,
} from '~routes';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { useActionSidebarContext } from '~context';
import { ACTION } from '~constants/actions';
import Numeral from '~shared/Numeral';
import WidgetBoxList from '~v5/common/WidgetBoxList';
import UserAvatars from '~v5/shared/UserAvatars';
import ProgressBar from '~v5/shared/ProgressBar';
import EmptyWidgetState from '~v5/common/WidgetBox/partials/EmptyWidgetState';
import MessageNumber from '~v5/shared/MessageNumber';
import TitleWithNumber from '~v5/shared/TitleWithNumber';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts';
import TeamReputationSummaryRow from '~v5/common/TeamReputationSummary/partials/TeamReputationSummaryRow';
import DonutChart from '~v5/common/DonutChart';
import { useGetHomeWidget } from './hooks';
import {
  useCreateTeamBreadcrumbs,
  useGetSelectedTeamFilter,
} from '~hooks/useTeamsBreadcrumbs';

const displayName = 'common.ColonyHome';

const ColonyHome = () => {
  const { colony } = useColonyContext();
  const { metadata } = colony || {};
  const { objective } = metadata || {};
  const selectedTeam = useGetSelectedTeamFilter();
  const agreements = undefined;
  const {
    activeActions,
    allMembers,
    teamColor,
    currentTokenBalance,
    membersLoading,
    nativeToken,
    allTeams,
    chartData,
    otherTeamsReputation,
    hoveredSegment,
    setHoveredSegment,
  } = useGetHomeWidget(selectedTeam?.nativeId);
  const teamsBreadcrumbs = useCreateTeamBreadcrumbs();
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  useSetPageHeadingTitle(formatText({ id: 'colonyHome.title' }));
  useSetPageBreadcrumbs(teamsBreadcrumbs);

  if (!colony) {
    return null;
  }

  const openSidebar = () => {
    toggleActionSidebarOn({
      [ACTION_TYPE_FIELD_NAME]: ACTION.MANAGE_COLONY_OBJECTIVES,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <WidgetBoxList
        items={[
          {
            key: '1',
            title: formatText({ id: 'colonyHome.actions' }),
            value: <h4 className="heading-4">{activeActions}</h4>,
            className: clsx('text-base-white', {
              [teamColor]: selectedTeam,
              'bg-gray-900 border-gray-900': !selectedTeam,
            }),
            href: '/',
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
            href: '/',
          },
        ]}
      />

      <WidgetBoxList
        className="!flex-col"
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
                <p className="text-sm text-gray-600 mb-[1.8rem] line-clamp-2">
                  {objective.description}
                </p>
                <ProgressBar
                  progress={objective.progress || 0}
                  className="ml-0"
                  additionalText="%"
                  isTall
                  barClassName={selectedTeam ? teamColor : 'bg-blue-400'}
                />
              </>
            ) : (
              <EmptyWidgetState
                title={formatText({ id: 'dashboard.objective.widget.noData' })}
                actionTitle={formatText({
                  id: 'dashboard.objective.widget.createObjective',
                })}
                className="p-[2.7rem]"
                onClick={openSidebar}
              />
            ),
            contentClassName: 'w-full',
            className:
              'flex-col p-6 bg-base-white h-[11.25rem] sm:cursor-pointer',
            href: objective ? COLONY_DETAILS_ROUTE : undefined,
            onClick: openSidebar,
          },
          {
            key: '2',
            value: (
              <div className="flex w-full gap-6">
                <div className="relative max-w-[9.375rem] -mt-1">
                  <DonutChart
                    data={chartData || []}
                    hoveredSegment={hoveredSegment}
                    setHoveredSegment={setHoveredSegment}
                  />
                </div>
                <div className="flex flex-col gap-[0.8rem]">
                  <div className="-mt-2">
                    <span className="uppercase text-4 text-gray-400 mb-[0.45rem]">
                      {formatText({ id: 'dashboard.team.widget.title' })}
                    </span>
                    <h3 className="text-2">
                      {formatText({ id: 'dashboard.team.widget.subtitle' })}
                    </h3>
                  </div>
                  {allTeams?.length ? (
                    <div className="w-full min-w-[10rem] sm:min-w-[15.438rem]">
                      <ul
                        className={clsx({
                          'flex flex-col justify-center min-h-[6.25rem]':
                            allTeams?.length < 4,
                        })}
                      >
                        {allTeams.map((team, index) => {
                          const { nativeId } = team;
                          return (
                            index < 3 && (
                              <li
                                key={nativeId}
                                className={clsx(
                                  'flex items-center text-sm [&:not(:last-child)]:mb-3',
                                  {
                                    'transition-all font-semibold':
                                      hoveredSegment?.id === team.id,
                                  },
                                )}
                              >
                                <TeamReputationSummaryRow
                                  team={team}
                                  suffix="%"
                                />
                              </li>
                            )
                          );
                        })}
                        {!!otherTeamsReputation && (
                          <div className="flex items-center text-sm">
                            <span className="flex items-center flex-grow">
                              <span className="flex rounded-full w-[0.625rem] h-[0.625rem] mr-2 bg-gray-100" />
                              <span
                                className={clsx({
                                  'transition-all font-semibold':
                                    hoveredSegment?.id === '4',
                                })}
                              >
                                {formatText({
                                  id: 'label.allOther',
                                })}
                              </span>
                            </span>
                            <span className="font-medium">
                              <Numeral
                                value={Number(otherTeamsReputation).toFixed(1)}
                                suffix="%"
                              />
                            </span>
                          </div>
                        )}
                      </ul>
                    </div>
                  ) : (
                    <EmptyWidgetState
                      title={formatText({ id: 'dashboard.team.widget.noData' })}
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
              'flex-col items-start p-6 bg-base-white h-[12.5rem] sm:cursor-pointer sm:hover:text-gray-900',
            href: allTeams?.length ? COLONY_TEAMS_ROUTE : undefined,
          },
          {
            key: '3',
            title: (
              <TitleWithNumber
                title={formatText({ id: 'dashboard.agreements.widget.title' })}
                number={0}
                className={clsx('transition-all', {
                  'sm:hover:text-blue-400': agreements,
                })}
              />
            ),
            titleClassName: 'text-2 mb-4',
            value: agreements ? (
              <div className="flex flex-col gap-[0.375rem]">
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
                title={formatText({ id: 'dashboard.agreements.widget.noData' })}
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
            className:
              'flex-col p-6 bg-base-white h-[11.25rem] sm:cursor-pointer',
            href: agreements ? COLONY_AGREEMENTS_ROUTE : undefined,
          },
        ]}
      />
    </div>
  );
};

ColonyHome.displayName = displayName;

export default ColonyHome;
