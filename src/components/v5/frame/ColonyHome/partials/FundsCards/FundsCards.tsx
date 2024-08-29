import { Plus } from '@phosphor-icons/react';
import React from 'react';

import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import WidgetCards from '~v5/common/WidgetCards/index.ts';

export const FundsCards = () => {
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  const onNewTeamClick = () => {
    toggleActionSidebarOn({
      [ACTION_TYPE_FIELD_NAME]: Action.CreateNewTeam,
    });
  };

  const { colony } = useColonyContext();

  const teams = colony.domains?.items || [];

  return (
    <WidgetCards.List>
      {teams.map((item) => {
        return <WidgetCards.Item title={item?.metadata?.name} />;
      })}
      {/* Teams always will have at least 1 team by default - it is general */}
      {teams.length < 2 && (
        <WidgetCards.Item
          variant="dashed"
          icon={Plus}
          title="Create team"
          onClick={onNewTeamClick}
          className="justify-center uppercase text-gray-200"
        />
      )}
    </WidgetCards.List>
  );
};
