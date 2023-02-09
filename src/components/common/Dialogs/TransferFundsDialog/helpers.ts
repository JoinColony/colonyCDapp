import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';

import { Colony } from '~types';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

export const getTransferFundsDialogPayload = (
  colony: Colony,
  {
    tokenAddress,
    amount: transferAmount,
    fromDomain: sourceDomain,
    toDomain,
    annotation: annotationMessage,
  },
) => {
  const colonyTokens = colony?.tokens?.items || [];
  const selectedToken = colonyTokens.find(
    (token) => token?.token.tokenAddress === tokenAddress,
  );
  const decimals = getTokenDecimalsWithFallback(selectedToken?.token.decimals);

  // Convert amount string with decimals to BigInt (eth to wei)
  const amount = BigNumber.from(moveDecimal(transferAmount, decimals));

  return {
    colonyAddress: colony?.colonyAddress,
    colonyName: colony?.name,
    // version,
    fromDomainId: parseInt(sourceDomain, 10),
    toDomainId: parseInt(toDomain, 10),
    amount,
    tokenAddress,
    annotationMessage,
  };
};
