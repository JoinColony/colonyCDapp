import React, { type FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { currencySymbolMap } from '~constants/currency.ts';
import { useCurrencyContext } from '~context/CurrencyContext/CurrencyContext.ts';
import { useColonyFiltersContext } from '~context/GlobalFiltersContext/ColonyFiltersContext.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { COLONY_BALANCES_ROUTE } from '~routes/routeConstants.ts';
import { NumeralCurrency } from '~shared/Numeral/index.ts';
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

  const { updateTeamFilter } = useColonyFiltersContext();
  const navigate = useNavigate();
  const { colonyName } = useParams();

  const selectedTeamName = selectedDomain?.metadata?.name;
  const trend = getValuesTrend(total, previousTotal);

  const nativeId = selectedDomain?.nativeId;
  const onItemClick = () => {
    if (nativeId) {
      updateTeamFilter(nativeId.toString());
    }
    navigate(`/${colonyName}/${COLONY_BALANCES_ROUTE}`);
  };

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
        <FundsCardsSubTitle
          className={loading ? 'mt-1' : 'my-0.5'}
          isLoading={loading}
          value={
            <NumeralCurrency
              value={total ?? '-'}
              prefix={currencySymbolMap[currency]}
              decimals={18}
            />
          }
          currency={currency}
        />
      }
      onClick={onItemClick}
    >
      <FundsCardsTotalDescription
        percent={trend.value}
        isIncrease={trend.isIncrease}
        isLoading={loading}
      />
    </WidgetCards.Item>
  );
};
