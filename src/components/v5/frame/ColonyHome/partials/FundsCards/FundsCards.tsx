import { Plus } from '@phosphor-icons/react';
import React from 'react';

import { Action } from '~constants/actions.ts';
import { currencySymbolMap } from '~constants/currency.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import Numeral from '~shared/Numeral/index.ts';
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

  const { colony } = useColonyContext();

  const teams = colony.domains?.items || [];

  // Teams always will have at least 1 team by default - it is general
  const isAddNewTeamVisible = teams.length < 2;
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
      <WidgetCards.List className="w-full">
        <FundsCardsTotalItem />
        {teams.map((item) => {
          const currency = 'USD'; // @TODO: use item currency instead
          return (
            <WidgetCards.Item
              key={item?.id}
              // @TODO: update onClick when it will be ready
              onClick={() => {}}
              title={item?.metadata?.name}
              // @TODO: update with a real teams data
              subTitle={
                <FundsCardsSubTitle
                  currency={currency}
                  value={
                    <Numeral
                      value="15,779.00"
                      prefix={currencySymbolMap[currency]}
                    />
                  }
                />
              }
            />
          );
        })}
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
