import { BigNumber } from 'ethers';
import { useCallback } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { getBalanceForTokenAndDomain } from '~utils/tokens.ts';

export const useHasEnoughTokensToClaim = (
  domainId: number,
  tokenAddress: string,
  availableToClaim: string | null | undefined,
) => {
  const {
    colony: { balances },
  } = useColonyContext();

  const checkIfHasEnoughFunds = useCallback(() => {
    const selectedTokenBalance = getBalanceForTokenAndDomain(
      balances,
      tokenAddress,
      domainId,
    );

    return BigNumber.from(selectedTokenBalance ?? '0').gte(
      availableToClaim ?? '0',
    );
  }, [availableToClaim, balances, domainId, tokenAddress]);

  return checkIfHasEnoughFunds;
};
