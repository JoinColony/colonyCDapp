import React from 'react';

import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { COLONY_DETAILS_ROUTE } from '~routes/index.ts';
import { formatText } from '~utils/intl.ts';
import { getTeamColor } from '~utils/teams.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import WidgetBox from '~v5/common/WidgetBox/index.ts';
import EmptyWidgetState from '~v5/common/WidgetBox/partials/EmptyWidgetState.tsx';
import ProgressBar from '~v5/shared/ProgressBar/index.ts';

const displayName = 'v5.frame.ColonyHome.Objective';

const Objective = () => {
  const selectedDomain = useGetSelectedDomainFilter();
  const nativeDomainId = selectedDomain?.nativeId ?? undefined;

  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  const {
    colony: { domains, metadata },
  } = useColonyContext();
  const { objective } = metadata || {};

  const selectedTeamColor = domains?.items.find(
    (domain) => domain?.nativeId === nativeDomainId,
  )?.metadata?.color;
  const teamColor = getTeamColor(selectedTeamColor);

  const openManageObjectives = () => {
    toggleActionSidebarOn({
      [ACTION_TYPE_FIELD_NAME]: Action.ManageColonyObjectives,
    });
  };

  return (
    <WidgetBox
      title={formatText({ id: 'dashboard.objective.widget.title' })}
      titleClassName="uppercase text-4 text-gray-400 mb-2"
      value={
        objective ? (
          <>
            <span className="text-2 mb-2 transition-all line-clamp-1 w-full sm:hover:text-blue-400">
              {objective.title}
            </span>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2 break-word w-full">
              {objective.description}
            </p>
            <ProgressBar
              progress={objective.progress || 0}
              className="ml-0"
              additionalText="%"
              isTall
              barClassName={selectedDomain ? teamColor : 'bg-blue-400'}
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
      className="flex-col p-6 bg-base-white min-h-[10.5rem]"
      href={objective ? COLONY_DETAILS_ROUTE : undefined}
      onClick={openManageObjectives}
    />
  );
};

Objective.displayName = displayName;
export default Objective;
