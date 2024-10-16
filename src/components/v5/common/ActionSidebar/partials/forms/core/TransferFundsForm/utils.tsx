import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';

import { DecisionMethod } from '~gql';
import { type Colony } from '~types/graphql.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { extractColonyDomains, findDomainByNativeId } from '~utils/domains.ts';
import { sanitizeHTML } from '~utils/strings.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';

import { type TransferFundsFormValues } from './hooks.ts';

export const getTransferFundsPayload = (
  colony: Colony,
  {
    amount,
    tokenAddress,
    from: fromDomainId,
    to: toDomainId,
    description: annotationMessage,
    title,
    decisionMethod,
    createdIn: createdInDomainId,
  }: TransferFundsFormValues,
) => {
  const colonyTokens = colony?.tokens?.items || [];
  const selectedToken = colonyTokens.find(
    (token) => token?.token.tokenAddress === tokenAddress,
  );
  const decimals = getTokenDecimalsWithFallback(selectedToken?.token.decimals);

  // Convert amount string with decimals to BigInt (eth to wei)
  const transferAmount = BigNumber.from(moveDecimal(amount, decimals));

  const fromDomain = findDomainByNativeId(Number(fromDomainId), colony);
  const toDomain = findDomainByNativeId(Number(toDomainId), colony);
  const createdInDomain = findDomainByNativeId(
    Number(createdInDomainId),
    colony,
  );

  return {
    colonyAddress: colony.colonyAddress,
    colonyName: colony.name,
    tokenAddress,
    fromDomain,
    toDomain,
    amount: transferAmount,
    annotationMessage: annotationMessage
      ? sanitizeHTML(annotationMessage)
      : undefined,
    customActionTitle: title,
    isMultiSig: decisionMethod === DecisionMethod.MultiSig,
    colonyRoles: extractColonyRoles(colony.roles),
    colonyDomains: extractColonyDomains(colony.domains),
    createdInDomain,
  };
};
