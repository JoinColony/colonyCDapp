import React from 'react';

import { ACTION } from '~constants/actions';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import useColonyContext from '~hooks/useColonyContext';
import { useGetSelectedTeamFilter } from '~hooks/useTeamsBreadcrumbs';
import { COLONY_DETAILS_ROUTE } from '~routes';
import { formatText } from '~utils/intl';
import { getTeamColor } from '~utils/teams';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts';
import WidgetBox from '~v5/common/WidgetBox';
import EmptyWidgetState from '~v5/common/WidgetBox/partials/EmptyWidgetState';
import ProgressBar from '~v5/shared/ProgressBar';

const displayName = 'common.ColonyHome.Objective';

const Objective = () => {
  const selectedTeam = useGetSelectedTeamFilter();
  const nativeTeamId = selectedTeam?.nativeId ?? undefined;

  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  const { colony } = useColonyContext();
  const { domains } = colony || {};
  const { objective } = colony?.metadata || {};

  const selectedTeamColor = domains?.items.find(
    (domain) => domain?.nativeId === nativeTeamId,
  )?.metadata?.color;
  const teamColor = getTeamColor(selectedTeamColor);

  const openManageObjectives = () => {
    toggleActionSidebarOn({
      [ACTION_TYPE_FIELD_NAME]: ACTION.MANAGE_COLONY_OBJECTIVES,
    });
  };

  return (
    <WidgetBox
      title={formatText({ id: 'dashboard.objective.widget.title' })}
      titleClassName="uppercase text-4 text-gray-400 mb-2"
      value={
        objective ? (
          <>
            <span className="text-2 mb-1 transition-all line-clamp-1 w-full sm:hover:text-blue-400">
              {objective.title}
            </span>
            <p className="text-sm text-gray-600 mb-[1.6875rem] line-clamp-2 break-word w-full">
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
            title={formatText({
              id: 'dashboard.objective.widget.noData',
            })}
            actionTitle={formatText({
              id: 'dashboard.objective.widget.createObjective',
            })}
            className="p-[2.7rem]"
            onClick={openManageObjectives}
          />
        )
      }
      contentClassName="w-full"
      className="flex-col p-6 bg-base-white min-h-[11.25rem]"
      href={objective ? COLONY_DETAILS_ROUTE : undefined}
      onClick={openManageObjectives}
    />
  );
};

Objective.displayName = displayName;
export default Objective;
