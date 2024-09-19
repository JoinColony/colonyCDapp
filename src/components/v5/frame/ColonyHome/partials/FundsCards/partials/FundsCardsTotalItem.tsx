import React, { type FC } from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { currencySymbolMap } from '~constants/currency.ts';
import { useCurrencyContext } from '~context/CurrencyContext/CurrencyContext.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import Numeral from '~shared/Numeral/index.ts';
import { getValuesTrend } from '~utils/balance/getValuesTrend.ts';
import { formatText } from '~utils/intl.ts';
import WidgetCards from '~v5/common/WidgetCards/index.ts';

import { usePreviousTotalData, useTotalData } from '../hooks.ts';

import { FundsCardsSubTitle } from './FundsCardsSubTitle.tsx';
import { FundsCardsTotalDescription } from './FundsCardsTotalDescription.tsx';

interface FundsCardsTotalItemProps {
  className?: string;
}
export const FundsCardsTotalItem: FC<FundsCardsTotalItemProps> = ({
  className,
}) => {
  const selectedDomain = useGetSelectedDomainFilter();
  const { total, loading } = useTotalData(selectedDomain?.id);
  const { previousTotal } = usePreviousTotalData();
  const { currency } = useCurrencyContext();

  const selectedTeamName = selectedDomain?.metadata?.name;
  const trend = getValuesTrend(total, previousTotal);

  return (
    <WidgetCards.Item
      className={className}
      title={
        <LoadingSkeleton isLoading={loading} className="h-5 w-[34px] rounded">
          <span className="font-semibold">
            {formatText({ id: 'dashboard.team.cards.totalFunds' })}
            {!!selectedTeamName && ` ${selectedTeamName}`}
          </span>
        </LoadingSkeleton>
      }
      subTitle={
        <div className="py-1">
          <FundsCardsSubTitle
            isLoading={loading}
            value={
              <Numeral
                value={total ?? '-'}
                prefix={currencySymbolMap[currency]}
              />
            }
            currency={currency}
          />
        </div>
      }
    >
      <FundsCardsTotalDescription
        percent={trend.value}
        isIncrease={trend.isIncrease}
        isLoading={loading}
      />
    </WidgetCards.Item>
  );
};
