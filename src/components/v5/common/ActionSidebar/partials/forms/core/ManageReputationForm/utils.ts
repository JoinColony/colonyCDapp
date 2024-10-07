import Decimal from 'decimal.js';
import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import { type TestContext } from 'yup';

import { DecisionMethod } from '~gql';
import { type ManageReputationPermissionsPayload } from '~redux/sagas/actions/manageReputation.ts';
import { type ManageReputationMotionPayload } from '~redux/sagas/motions/manageReputationMotion.ts';
import { type Colony } from '~types/graphql.ts';
import { getMotionPayload } from '~utils/motions.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';

import { ModificationOption } from './consts.ts';
import { type ManageReputationFormValues } from './hooks.ts';

export const getManageReputationPayload = (
  colony: Colony,
  nativeTokenDecimals: number,
  {
    amount,
    team,
    description,
    member,
    createdIn,
    modification,
    decisionMethod,
  }: ManageReputationFormValues,
): ManageReputationPermissionsPayload | ManageReputationMotionPayload => {
  const isSmiteAction = modification === ModificationOption.RemoveReputation;
  const reputationChangeAmount = new Decimal(amount)
    .mul(new Decimal(10).pow(nativeTokenDecimals))
    // Smite amount needs to be negative, otherwise leave it as it is
    .mul(isSmiteAction ? -1 : 1);

  const basePayload = {
    colonyAddress: colony.colonyAddress,
    colonyName: colony.name,
    domainId: team,
    userAddress: member ?? '',
    amount: BigNumber.from(reputationChangeAmount.toString()),
    isSmitingReputation: isSmiteAction,
    annotationMessage: description,
    customActionTitle: '',
  };

  if (decisionMethod === DecisionMethod.Permissions) {
    return basePayload;
  }

  return {
    ...basePayload,
    motionDomainId: createdIn,
    ...getMotionPayload(decisionMethod === DecisionMethod.MultiSig, colony),
  };
};

export const reputationAmountChangeValidation = ({
  value,
  context,
  userReputation,
  colony,
}: {
  value: string | null | undefined;
  context: TestContext<object>;
  userReputation: string | undefined;
  colony: Colony;
}) => {
  const { parent } = context;
  const { modification } = parent || {};
  const isSmite = modification === ModificationOption.RemoveReputation;
  const { nativeToken } = colony;

  if (!isSmite || !value) {
    return true;
  }

  const amountValueCalculated = BigNumber.from(
    moveDecimal(
      value !== '' ? value : '0',
      getTokenDecimalsWithFallback(nativeToken.decimals),
    ),
  ).toString();

  const newValueIsGreaterThanZero = BigNumber.from(userReputation || '0').gte(
    amountValueCalculated,
  );

  return newValueIsGreaterThanZero;
};

export const moreThanZeroAmountValidation = (
  value: string | null | undefined,
  colony: Colony,
) => {
  if (!value) {
    return true;
  }

  const { nativeToken } = colony;

  return BigNumber.from(
    moveDecimal(value, getTokenDecimalsWithFallback(nativeToken.decimals)),
  ).gt(0);
};
