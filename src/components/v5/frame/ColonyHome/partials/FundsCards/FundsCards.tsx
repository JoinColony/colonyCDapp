import { Plus } from '@phosphor-icons/react';
import React from 'react';

import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useLargeTablet } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import WidgetCards from '~v5/common/WidgetCards/index.ts';

import { FundsCardsSubTitle } from './partials/FundsCardsSubTitle.tsx';
import { FundsCardsTotalItem } from './partials/FundsCardsTotalItem.tsx';

export const FundsCards = () => {
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  const onNewTeamClick = () => {
    toggleActionSidebarOn({
      [ACTION_TYPE_FIELD_NAME]: Action.CreateNewTeam,
    });
  };

  const isLargeTablet = useLargeTablet();

  const { colony } = useColonyContext();

  const teams = colony.domains?.items || [];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
      {isLargeTablet && (
        <FundsCardsTotalItem className="mr-0 min-w-[100%] sm:min-w-[55%]" />
      )}

      <WidgetCards.List className="sm:w-[42%] lg:w-[100%]">
        {!isLargeTablet && <FundsCardsTotalItem />}
        {teams.map((item) => {
          return (
            <WidgetCards.Item
              key={item?.id}
              title={item?.metadata?.name}
              // @TODO: update with a real teams data
              subTitle={<FundsCardsSubTitle value="123" currency="usd" />}
            />
          );
        })}
        {/* Teams always will have at least 1 team by default - it is general */}
        {teams.length < 2 && (
          <WidgetCards.Item
            variant="dashed"
            icon={Plus}
            title={formatText({ id: 'dashboard.team.cards.createTeam' })}
            onClick={onNewTeamClick}
            className="justify-center uppercase text-gray-200"
          />
        )}
      </WidgetCards.List>
    </div>
  );
};
