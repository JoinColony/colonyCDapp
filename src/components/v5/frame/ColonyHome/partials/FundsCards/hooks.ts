import Decimal from 'decimal.js';
import { useEffect, useState } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useCurrencyContext } from '~context/CurrencyContext/CurrencyContext.ts';
import { type SupportedCurrencies } from '~gql';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { type ColonyBalances } from '~types/graphql.ts';
import { notNull } from '~utils/arrays/index.ts';
import { fetchCurrentPrice } from '~utils/currency/currency.ts';

const calculateTotalFunds = async (
  balances: ColonyBalances,
  currency: SupportedCurrencies,
  selectedDomainNativeId: number | undefined,
): Promise<Decimal | null> => {
  let isError = false;
  const funds = balances.items
    ?.filter(notNull)
    .filter(({ domain }) =>
      !selectedDomainNativeId
        ? domain === null
        : domain?.nativeId === selectedDomainNativeId,
    )
    .reduce(
      async (total, { balance, token: { tokenAddress, decimals } }) => {
        const currentPrice = await fetchCurrentPrice({
          contractAddress: tokenAddress,
          conversionDenomination: currency,
        });

        if (currentPrice == null) {
          isError = true;
        }

        const balanceInWeiToEth = new Decimal(balance).div(10 ** decimals);

        return (await total).add(
          new Decimal(balanceInWeiToEth).mul(currentPrice ?? 0),
        );
      },
      Promise.resolve(new Decimal(0)),
    );

  if (isError) {
    return null;
  }

  return (await funds) ?? new Decimal(0);
};

export const useTotalFunds = () => {
  const selectedDomain = useGetSelectedDomainFilter();
  const { colony } = useColonyContext();
  const { currency } = useCurrencyContext();
  const { balances: colonyBalances } = colony || {};
  const [totalFunds, setTotalFunds] = useState<Decimal | null>(new Decimal(0));

  useEffect(() => {
    const getTotalFunds = async (balances: ColonyBalances) => {
      const funds = await calculateTotalFunds(
        balances,
        currency,
        selectedDomain?.nativeId,
      );
      setTotalFunds(funds);
    };

    if (colonyBalances) {
      getTotalFunds(colonyBalances);
    }
  }, [colonyBalances, currency, selectedDomain]);

  return totalFunds;
};
