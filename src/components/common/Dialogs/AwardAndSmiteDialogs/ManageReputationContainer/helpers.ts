import Decimal from 'decimal.js';
import { BigNumber } from 'ethers';

import { Colony } from '~types';
import { ManageReputationMotionPayload } from '~redux/sagas/motions/manageReputationMotion';

import { FormValues } from './validation';

export const getManageReputationDialogPayload = (
  colony: Colony,
  isSmiteAction: boolean,
  nativeTokenDecimals: number,
  { amount, domainId, annotation, user, motionDomainId }: FormValues,
) => {
  const reputationChangeAmount = new Decimal(amount)
    .mul(new Decimal(10).pow(nativeTokenDecimals))
    // Smite amount needs to be negative, otherwise leave it as it is
    .mul(isSmiteAction ? -1 : 1);

  return {
    colonyAddress: colony.colonyAddress,
    colonyName: colony.name,
    domainId,
    motionDomainId,
    userAddress: user?.walletAddress ?? '',
    annotationMessage: annotation,
    amount: BigNumber.from(reputationChangeAmount.toString()),
    isSmitingReputation: isSmiteAction,
    customActionTitle: '',
  } as ManageReputationMotionPayload;
};
