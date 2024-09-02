import { Plus } from '@phosphor-icons/react';
import React from 'react';

import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import WidgetCards from '~v5/common/WidgetCards/index.ts';

import { WidgetSubTitle } from './partials/WidgetSubTitle.tsx';
import { WidgetTotalDescription } from './partials/WidgetTotalDescription.tsx';

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
      <WidgetCards.Item
        title={<span className="font-semibold">Total</span>}
        subTitle={
          <WidgetSubTitle amount={1000} currency="usd" currencySymbol="$" />
        }
      >
        <WidgetTotalDescription />
      </WidgetCards.Item>
      {teams.map((item) => {
        return (
          <WidgetCards.Item
            key={item?.id}
            title={item?.metadata?.name}
            subTitle={
              <WidgetSubTitle amount={1000} currency="usd" currencySymbol="$" />
            }
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
  );
};
