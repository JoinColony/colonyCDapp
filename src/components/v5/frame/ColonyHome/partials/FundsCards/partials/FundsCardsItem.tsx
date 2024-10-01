import React, { type FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { currencySymbolMap } from '~constants/currency.ts';
import { useCurrencyContext } from '~context/CurrencyContext/CurrencyContext.ts';
import {
  COLONY_BALANCES_ROUTE,
  TEAM_SEARCH_PARAM,
} from '~routes/routeConstants.ts';
import { NumeralCurrency } from '~shared/Numeral/index.ts';
import { setQueryParamOnUrl } from '~utils/urls.ts';
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

  const navigate = useNavigate();

  const { colonyName } = useParams();
  const onTeamClick = () => {
    navigate(
      setQueryParamOnUrl({
        path: `/${colonyName}/${COLONY_BALANCES_ROUTE}`,
        params: {
          [TEAM_SEARCH_PARAM]: nativeId?.toString(),
        },
      }),
    );
  };

  return (
    <WidgetCards.Item
      onClick={onTeamClick}
      title={
        <LoadingSkeleton isLoading={loading} className="mb-1 h-5 w-14 rounded">
          {domainName}
        </LoadingSkeleton>
      }
      subTitle={
        <FundsCardsSubTitle
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
