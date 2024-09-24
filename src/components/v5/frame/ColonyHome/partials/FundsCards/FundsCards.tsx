import { Plus } from '@phosphor-icons/react';
import React from 'react';

import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useSubDomains } from '~hooks/useSubDomains.ts';
import { notMaybe } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import WidgetCards from '~v5/common/WidgetCards/index.ts';

import { FundsCardsItem } from './partials/FundsCardsItem.tsx';
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

  const subTeams = useSubDomains();

  const isAddNewTeamVisible = !subTeams || subTeams.length < 1;
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
      <WidgetCards.List className="w-full">
        <FundsCardsTotalItem />
        {subTeams
          ?.filter(notMaybe)
          .map((item) => (
            <FundsCardsItem
              key={item?.id}
              domainId={item?.id}
              domainName={item?.metadata?.name}
            />
          ))}

        {isAddNewTeamVisible && (
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
