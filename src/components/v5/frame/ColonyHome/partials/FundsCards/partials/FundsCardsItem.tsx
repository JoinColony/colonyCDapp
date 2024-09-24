import React, { type FC } from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { currencySymbolMap } from '~constants/currency.ts';
import { useCurrencyContext } from '~context/CurrencyContext/CurrencyContext.ts';
import { NumeralCurrency } from '~shared/Numeral/index.ts';
import WidgetCards from '~v5/common/WidgetCards/index.ts';

import { useTotalData } from '../hooks.ts';

import { FundsCardsSubTitle } from './FundsCardsSubTitle.tsx';

interface FundsCardsItemProps {
  domainId?: string;
  domainName?: string;
}
export const FundsCardsItem: FC<FundsCardsItemProps> = ({
  domainId,
  domainName,
}) => {
  const { total, loading } = useTotalData(domainId);
  const { currency } = useCurrencyContext();

  return (
    <WidgetCards.Item
      // @TODO: update onClick when it will be ready
      onClick={() => {}}
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
            />
          }
        />
      }
    />
  );
};
