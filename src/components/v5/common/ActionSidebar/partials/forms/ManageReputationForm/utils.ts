import Decimal from 'decimal.js';
import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import { type TestContext } from 'yup';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { type ManageReputationMotionPayload } from '~redux/sagas/motions/manageReputationMotion.ts';
import { DecisionMethod } from '~types/actions.ts';
import { type Colony } from '~types/graphql.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { extractColonyDomains } from '~utils/domains.ts';
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
): ManageReputationMotionPayload => {
  const isSmiteAction = modification === ModificationOption.RemoveReputation;
  const reputationChangeAmount = new Decimal(amount)
    .mul(new Decimal(10).pow(nativeTokenDecimals))
    // Smite amount needs to be negative, otherwise leave it as it is
    .mul(isSmiteAction ? -1 : 1);
  const isMultiSig = decisionMethod === DecisionMethod.MultiSig;

  return {
    colonyAddress: colony.colonyAddress,
    colonyName: colony.name,
    domainId: team,
    userAddress: member ?? '',
    amount: BigNumber.from(reputationChangeAmount.toString()),
    isSmitingReputation: isSmiteAction,
    annotationMessage: description,
    customActionTitle: '',
    motionDomainId: createdIn,
    isMultiSig,
    colonyRoles: extractColonyRoles(colony.roles),
    colonyDomains: extractColonyDomains(colony.domains),
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
      getTokenDecimalsWithFallback(
        nativeToken.decimals,
        DEFAULT_TOKEN_DECIMALS,
      ),
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
    moveDecimal(
      value,
      getTokenDecimalsWithFallback(
        nativeToken.decimals,
        DEFAULT_TOKEN_DECIMALS,
      ),
    ),
  ).gt(0);
};
