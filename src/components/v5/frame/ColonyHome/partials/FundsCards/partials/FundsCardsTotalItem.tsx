import React, { type FC } from 'react';

import { currencySymbolMap } from '~constants/currency.ts';
import { useCurrencyContext } from '~context/CurrencyContext/CurrencyContext.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import Numeral from '~shared/Numeral/index.ts';
import { formatText } from '~utils/intl.ts';
import WidgetCards from '~v5/common/WidgetCards/index.ts';

import { useTotalFunds } from '../hooks.ts';

import { FundsCardsSubTitle } from './FundsCardsSubTitle.tsx';
import { FundsCardsTotalDescription } from './FundsCardsTotalDescription.tsx';

interface FundsCardsTotalItemProps {
  className?: string;
}
export const FundsCardsTotalItem: FC<FundsCardsTotalItemProps> = ({
  className,
}) => {
  const selectedDomain = useGetSelectedDomainFilter();
  const selectedTeamName = selectedDomain?.metadata?.name;

  const totalFunds = useTotalFunds();

  const { currency } = useCurrencyContext();

  return (
    <WidgetCards.Item
      className={className}
      title={
        <span className="font-semibold">
          {formatText({ id: 'dashboard.team.cards.totalFunds' })}
          {!!selectedTeamName && ` ${selectedTeamName}`}
        </span>
      }
      subTitle={
        <div className="py-1">
          <FundsCardsSubTitle
            value={
              <Numeral
                value={totalFunds ?? '-'}
                prefix={currencySymbolMap[currency]}
              />
            }
            currency={currency}
          />
        </div>
      }
    >
      <FundsCardsTotalDescription />
    </WidgetCards.Item>
  );
};
