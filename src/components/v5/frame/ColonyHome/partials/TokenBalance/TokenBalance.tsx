import React from 'react';
import { useLocation } from 'react-router-dom';

import { useCurrencyContext } from '~context/CurrencyContext.tsx';
import { COLONY_BALANCES_ROUTE } from '~routes/index.ts';
import Numeral from '~shared/Numeral/index.ts';
import { currencySymbolMap } from '~utils/currency/config.ts';
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
      className="bg-base-bg border-base-bg"
    />
  );
};

TokenBalance.displayName = displayName;
export default TokenBalance;
