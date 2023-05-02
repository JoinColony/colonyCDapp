import Decimal from 'decimal.js';

import { Colony } from '~types';

export const getManageReputationDialogPayload = (
  colony: Colony,
  isSmiteAction: boolean,
  nativeTokenDecimals: number,
  { amount, domainId, annotation, user, motionDomainId },
) => {
  const reputationChangeAmount = new Decimal(amount)
    .mul(new Decimal(10).pow(nativeTokenDecimals))
    // Smite amount needs to be negative, otherwise leave it as it is
    .mul(isSmiteAction ? -1 : 1);

  return {
    colonyAddress: colony.colonyAddress,
    colonyName: colony.name,
    domainId,
    walletAddress: user.walletAddress,
    annotationMessage: annotation,
    amount: reputationChangeAmount.toString(),
    motionDomainId,
    isSmitingReputation: isSmiteAction,
  };
};
