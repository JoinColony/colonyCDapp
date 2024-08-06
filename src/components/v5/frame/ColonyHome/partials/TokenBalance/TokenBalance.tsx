import React from 'react';
import { useLocation } from 'react-router-dom';

import { currencySymbolMap } from '~constants/currency.ts';
import { useCurrencyContext } from '~context/CurrencyContext/CurrencyContext.ts';
import { COLONY_BALANCES_ROUTE } from '~routes/index.ts';
import Numeral from '~shared/Numeral/index.ts';
import { formatText } from '~utils/intl.ts';
import WidgetBox from '~v5/common/WidgetBox/index.ts';

import { useTotalFunds } from './hooks.ts';

const displayName = 'v5.frame.ColonyHome.TokenBalance';

const TokenBalance = () => {
  const { search } = useLocation();
  const { currency } = useCurrencyContext();
  const totalFunds = useTotalFunds();

  return (
    <WidgetBox
      title={formatText({ id: 'colonyHome.funds' })}
      value={
        <div className="flex items-center gap-2 heading-4">
          <Numeral
            value={totalFunds ?? '-'}
            prefix={currencySymbolMap[currency]}
          />
          <span className="text-1">{currency}</span>
        </div>
      }
      href={COLONY_BALANCES_ROUTE}
      searchParams={search}
      className="border-base-bg bg-base-bg"
    />
  );
};

TokenBalance.displayName = displayName;
export default TokenBalance;
