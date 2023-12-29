import React from 'react';
import { useLocation } from 'react-router-dom';

import { useCurrencyContext } from '~context/CurrencyContext';
import { COLONY_BALANCES_ROUTE } from '~routes';
import Numeral from '~shared/Numeral';
import { currencySymbolMap } from '~utils/currency/config';
import { formatText } from '~utils/intl';
import WidgetBox from '~v5/common/WidgetBox';

import { useTotalFunds } from './hooks';

const displayName = 'common.ColonyHome.Members';

const TokenBalance = () => {
  const { search } = useLocation();
  const { currency } = useCurrencyContext();
  const totalFunds = useTotalFunds();

  return (
    <WidgetBox
      title={formatText({ id: 'colonyHome.funds' })}
      value={
        <div className="flex items-center gap-2 heading-4">
          <Numeral value={totalFunds} prefix={currencySymbolMap[currency]} />
          <span className="text-1">{currency}</span>
        </div>
      }
      href={COLONY_BALANCES_ROUTE}
      searchParams={search}
    />
  );
};

TokenBalance.displayName = displayName;
export default TokenBalance;
