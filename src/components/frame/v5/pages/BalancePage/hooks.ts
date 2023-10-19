import { useMemo, useState } from 'react';
import { useColonyContext } from '~hooks';
import {
  adjustConvertedValue,
  convertToDecimalOrNull,
  getFormattedNumeralValue,
} from '~shared/Numeral';
import {
  getBalanceForTokenAndDomain,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';

export const useBalancePage = () => {
  const { colony } = useColonyContext();
  const { balances } = colony || {};
  const [isSortedDesc, setIsSortedDesc] = useState(true);
  const domainId = 1;

  const prepareTokensData = useMemo(
    () =>
      colony?.tokens?.items.map((item) => {
        const currentTokenBalance =
          getBalanceForTokenAndDomain(
            balances,
            item?.token?.tokenAddress || '',
            domainId,
          ) || 0;
        const decimals = getTokenDecimalsWithFallback(item?.token.decimals);
        let convertedValue = convertToDecimalOrNull(currentTokenBalance);
        if (convertedValue && decimals) {
          convertedValue = adjustConvertedValue(convertedValue, decimals);
        }
        const formattedValue = getFormattedNumeralValue(
          convertedValue,
          currentTokenBalance,
        );

        return {
          ...item,
          balance: formattedValue,
        };
      }),
    [colony?.tokens?.items, balances],
  );

  const onBalanceSort = () => {
    setIsSortedDesc(!isSortedDesc);

    prepareTokensData?.sort((a, b) => {
      if (isSortedDesc) {
        return a.balance > b.balance ? -1 : 1;
      }
      return b.balance > a.balance ? -1 : 1;
    });
  };

  return {
    colony: prepareTokensData,
    isSortedDesc,
    onBalanceSort,
  };
};
