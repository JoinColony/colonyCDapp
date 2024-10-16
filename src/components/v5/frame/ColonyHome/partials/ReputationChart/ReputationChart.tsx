import { Id } from '@colony/colony-js';
import clsx from 'clsx';
import React, { useState } from 'react';
import { defineMessages } from 'react-intl';

import { CoreAction } from '~actions';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { notNull } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import TeamReputationSummaryRow from '~v5/common/TeamReputationSummary/partials/TeamReputationSummaryRow.tsx';
import WidgetBox from '~v5/common/WidgetBox/index.ts';
import EmptyWidgetState from '~v5/common/WidgetBox/partials/EmptyWidgetState.tsx';
import DonutChart from '~v5/shared/DonutChart/index.ts';
import { type ChartData } from '~v5/shared/DonutChart/types.ts';

import { summaryLegendColor } from './consts.ts';
import { getTeamReputationChartData } from './utils.ts';

const displayName = 'v5.frame.ColonyHome.ReputationChart';

const MSG = defineMessages({
  legendNoTeams: {
    id: `${displayName}.legendNoTeams`,
    defaultMessage: 'There are no teams with reputation in the Colony',
  },
  legendNoTeamsAction: {
    id: `${displayName}.legendNoTeamsAction`,
    defaultMessage: 'Create a new action',
  },
});

const ReputationChart = () => {
  const {
    colony: { domains },
  } = useColonyContext();

  const [hoveredSegment, setHoveredSegment] = useState<
    ChartData | undefined | null
  >();

  const { show } = useActionSidebarContext();

  const updateHoveredSegment = (segmentData: ChartData | null | undefined) => {
    setHoveredSegment(segmentData);
  };

  const openCreateNewTeam = () => {
    show({
      [ACTION_TYPE_FIELD_NAME]: CoreAction.CreateDomain,
    });
  };

  const allTeams = (domains?.items || [])
    .filter(notNull)
    .filter(({ nativeId }) => nativeId !== Id.RootDomain)
    .sort(
      (a, b) => Number(b.reputationPercentage) - Number(a.reputationPercentage),
    );

  const chartData = getTeamReputationChartData(allTeams);

  const getChartLegend = () => {
    const doesReputationExist = chartData[0] ? chartData[0].value > 0 : false;

    if (chartData.length === 0) {
      return (
        <EmptyWidgetState
          title={formatText({
            id: 'dashboard.team.widget.noData',
          })}
          actionTitle={formatText({
            id: 'dashboard.team.widget.createTeam',
          })}
          className="h-full p-2"
          onClick={openCreateNewTeam}
        />
      );
    }

    if (!doesReputationExist) {
      return (
        <EmptyWidgetState
          title={<p className="text-center">{formatText(MSG.legendNoTeams)}</p>}
          actionTitle={formatText(MSG.legendNoTeamsAction)}
          className="px-[1.8rem] py-[2.3rem]"
          onClick={() => show()}
        />
      );
    }

    return (
      <div className="w-full">
        <ul className="flex flex-col justify-center gap-2">
          {chartData.map(({ id, label, color, value }) => (
            <li
              key={id}
              className={clsx('flex items-center text-sm', {
                'font-semibold transition-all': hoveredSegment?.id === id,
              })}
            >
              <TeamReputationSummaryRow
                color={summaryLegendColor[color] || summaryLegendColor.default}
                name={label}
                totalReputation={value.toString()}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <WidgetBox
      value={
        <div className="grid w-full grid-cols-[36%_1fr] justify-items-center gap-6">
          <div className="relative flex w-full max-w-[9.375rem] flex-shrink-0 items-center justify-center">
            <DonutChart
              data={chartData || []}
              hoveredSegment={hoveredSegment}
              updateHoveredSegment={updateHoveredSegment}
            />
          </div>
          <div className="flex w-full flex-col">
            <div>
              <p className="uppercase text-gray-400 text-4">
                {formatText({ id: 'dashboard.team.widget.title' })}
              </p>
              <h3 className="mb-3 text-2">
                {formatText({ id: 'dashboard.team.widget.subtitle' })}
              </h3>
            </div>
            {getChartLegend()}
          </div>
        </div>
      }
      className="flex-col bg-base-white p-6"
      // @BETA: Disabled for now
      // href={allTeams?.length ? COLONY_TEAMS_ROUTE : undefined}
    />
  );
};

ReputationChart.displayName = displayName;
export default ReputationChart;
