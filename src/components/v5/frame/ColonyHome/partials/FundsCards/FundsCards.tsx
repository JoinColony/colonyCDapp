import { Plus } from '@phosphor-icons/react';
import React from 'react';

import { Action } from '~constants/actions.ts';
import { currencySymbolMap } from '~constants/currency.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useCurrencyContext } from '~context/CurrencyContext/CurrencyContext.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import Numeral from '~shared/Numeral/index.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import WidgetCards from '~v5/common/WidgetCards/index.ts';

import { useTotalFunds } from './hooks.ts';
import { FundsCardsSubTitle } from './partials/FundsCardsSubTitle.tsx';
import { FundsCardsTotalDescription } from './partials/FundsCardsTotalDescription.tsx';

export const FundsCards = () => {
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();
  const { currency } = useCurrencyContext();
  const totalFunds = useTotalFunds();

  const onNewTeamClick = () => {
    toggleActionSidebarOn({
      [ACTION_TYPE_FIELD_NAME]: Action.CreateNewTeam,
    });
  };

  const selectedDomain = useGetSelectedDomainFilter();
  const selectedTeamName = selectedDomain?.metadata?.name;

  const { colony } = useColonyContext();

  const teams = colony.domains?.items || [];

  return (
    <WidgetCards.List>
      <WidgetCards.Item
        title={
          <span className="font-semibold">
            {formatText({ id: 'dashboard.team.cards.totalFunds' })}
            {!!selectedTeamName && ` ${selectedTeamName}`}
          </span>
        }
        subTitle={
          <FundsCardsSubTitle
            value={
              <Numeral
                value={totalFunds ?? '-'}
                prefix={currencySymbolMap[currency]}
              />
            }
            currency={currency}
          />
        }
      >
        <FundsCardsTotalDescription direction="up" />
      </WidgetCards.Item>
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
  );
};
