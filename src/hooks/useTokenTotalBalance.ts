import { useMemo } from 'react';

import { useColonyContext } from '~context/ColonyContext';
import { Address } from '~types';

const useTokenTotalBalance = (currentTokenAddress?: Address) => {
  const {
    colony: { balances },
  } = useColonyContext();

  const totalTokenBalance = useMemo(() => {
    if (balances?.items && currentTokenAddress) {
      return (
        balances.items
          /*
           * If the domain is not set, then we're dealing with "All Domains" (id 0)
           */
          .filter((balance) => balance?.domain === null)
          .find(
            (balance) => balance?.token?.tokenAddress === currentTokenAddress,
          ) || { balance: '0' }
      );
    }
    return { balance: '0' };
  }, [balances, currentTokenAddress]);

  return totalTokenBalance;
};

export default useTokenTotalBalance;
