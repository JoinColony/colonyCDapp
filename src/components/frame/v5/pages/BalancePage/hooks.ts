import { useState } from 'react';
import { useSearchContext } from '~context/SearchContext';
import { useColonyContext } from '~hooks';
import {
  adjustConvertedValue,
  convertToDecimalOrNull,
  getFormattedNumeralValue,
} from '~shared/Numeral';
import { searchMembers } from '~utils/members';
import {
  getBalanceForTokenAndDomain,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';

export const useBalancePage = () => {
  const { colony } = useColonyContext();
  const { balances } = colony || {};
  const { searchValue } = useSearchContext();
  const [isSortedDesc, setIsSortedDesc] = useState(true);
  const domainId = 1;

  const prepareTokensData = colony?.tokens?.items.map((item) => {
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
  });

  const onBalanceSortClick = () => {
    setIsSortedDesc(!isSortedDesc);

    prepareTokensData?.sort((a, b) => {
      if (isSortedDesc) {
        return a.balance - b.balance;
      }

      return b.balance - a.balance;
    });
  };
  console.log({ prepareTokensData });

  return {
    colony: prepareTokensData,
    isSortedDesc,
    onBalanceSortClick,
  };
};
