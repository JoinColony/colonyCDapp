import React, { type FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { currencySymbolMap } from '~constants/currency.ts';
import { useCurrencyContext } from '~context/CurrencyContext/CurrencyContext.ts';
import { useColonyFiltersContext } from '~context/GlobalFiltersContext/ColonyFiltersContext.ts';
import { COLONY_BALANCES_ROUTE } from '~routes/routeConstants.ts';
import { NumeralCurrency } from '~shared/Numeral/index.ts';
import WidgetCards from '~v5/common/WidgetCards/index.ts';

import { useTotalData } from '../hooks.ts';

import { FundsCardsSubTitle } from './FundsCardsSubTitle.tsx';

interface FundsCardsItemProps {
  domainId?: string;
  domainName?: string;
  nativeId?: number;
}
export const FundsCardsItem: FC<FundsCardsItemProps> = ({
  domainId,
  domainName,
  nativeId,
}) => {
  const { total, loading } = useTotalData(domainId);
  const { currency } = useCurrencyContext();

  const { updateTeamFilter } = useColonyFiltersContext();
  const navigate = useNavigate();
  const { colonyName } = useParams();

  const onTeamClick = () => {
    if (nativeId) {
      updateTeamFilter(nativeId.toString());
    }
    navigate(`/${colonyName}/${COLONY_BALANCES_ROUTE}`);
  };

  return (
    <WidgetCards.Item
      onClick={onTeamClick}
      title={
        <LoadingSkeleton isLoading={loading} className="h-5 w-14 rounded">
          <span className="flex">{domainName}</span>
        </LoadingSkeleton>
      }
      subTitle={
        <FundsCardsSubTitle
          className={loading ? 'mt-1' : 'mt-0.5'}
          currency={currency}
          isLoading={loading}
          value={
            <NumeralCurrency
              value={total.toString()}
              prefix={currencySymbolMap[currency]}
              decimals={18}
            />
          }
        />
      }
    />
  );
};
