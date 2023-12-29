import Decimal from 'decimal.js';
import { useEffect, useState } from 'react';

import { useCurrencyContext } from '~context/CurrencyContext';
import { SupportedCurrencies } from '~gql';
import { useColonyContext } from '~hooks';
import { ColonyBalances } from '~types';
import { notNull } from '~utils/arrays';
import { fetchCurrentPrice } from '~utils/currency/currency';

const calculateTotalFunds = async (
  balances: ColonyBalances,
  currency: SupportedCurrencies,
) => {
  const funds = balances.items
    ?.filter(notNull)
    .filter(({ domain }) => !!domain?.isRoot)
    .reduce(async (total, { balance, token: { tokenAddress } }) => {
      const currentPrice = await fetchCurrentPrice({
        contractAddress: tokenAddress,
        conversionDenomination: currency,
      });

      return (await total).add(new Decimal(balance).mul(currentPrice));
    }, Promise.resolve(new Decimal(0)));

  return (await funds) ?? new Decimal(0);
};

export const useTotalFunds = () => {
  const { colony } = useColonyContext();
  const { currency } = useCurrencyContext();
  const { balances: colonyBalances } = colony || {};
  const [totalFunds, setTotalFunds] = useState<Decimal>(new Decimal(0));

  useEffect(() => {
    const getTotalFunds = async (balances: ColonyBalances) => {
      const funds = await calculateTotalFunds(balances, currency);
      setTotalFunds(funds);
    };

    if (colonyBalances) {
      getTotalFunds(colonyBalances);
    }
  }, [colonyBalances, currency]);

  return totalFunds;
};
