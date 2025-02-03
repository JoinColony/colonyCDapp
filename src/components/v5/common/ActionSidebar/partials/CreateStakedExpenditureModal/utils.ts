import { Id } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import { type FieldValues } from 'react-hook-form';

import { Action } from '~constants/actions.ts';
import { type CreateStakedExpenditurePayload } from '~redux/sagas/expenditures/createStakedExpenditure.ts';
import { type Colony } from '~types/graphql.ts';
import { findDomainByNativeId } from '~utils/domains.ts';

import { getPaymentBuilderPayload } from '../forms/PaymentBuilderForm/utils.ts';
import { getSplitPaymentPayload } from '../forms/SplitPaymentForm/utils.ts';
import { getStagedPaymentPayload } from '../forms/StagedPaymentForm/utils.ts';

// Always create staked expenditures in the domain they are funded from
export const getCreatedInDomain = ({
  actionType,
  colony,
  formValues,
}: {
  actionType: Action;
  colony: Colony;
  formValues: any;
}) => {
  const rootDomain = findDomainByNativeId(Id.RootDomain, colony);

  switch (actionType) {
    case Action.PaymentBuilder:
    case Action.StagedPayment: {
      return (
        findDomainByNativeId(Number(formValues.from), colony) || rootDomain
      );
    }
    case Action.SplitPayment: {
      return (
        findDomainByNativeId(Number(formValues.team), colony) || rootDomain
      );
    }
    default:
      return null;
  }
};

export const getActionPayload = ({
  actionType,
  colony,
  formValues,
  networkInverseFee,
}: {
  actionType: Action;
  colony: Colony;
  formValues: any;
  networkInverseFee: string;
}) => {
  switch (actionType) {
    case Action.PaymentBuilder:
      return getPaymentBuilderPayload(colony, formValues, networkInverseFee);
    case Action.StagedPayment:
      return getStagedPaymentPayload(colony, formValues, networkInverseFee);
    case Action.SplitPayment:
      return getSplitPaymentPayload(colony, formValues, networkInverseFee);
    default:
      return null;
  }
};

export const getCreateStakedExpenditurePayload = ({
  actionType,
  colony,
  values,
  options,
}: {
  actionType: Action;
  colony: Colony;
  values: FieldValues;
  options: {
    networkInverseFee: string;
    stakeAmount: string;
    stakedExpenditureAddress: string;
    activeBalance: string | undefined;
  };
}): CreateStakedExpenditurePayload | null => {
  const {
    activeBalance,
    networkInverseFee,
    stakeAmount,
    stakedExpenditureAddress,
  } = options;

  const createdInDomain = getCreatedInDomain({
    actionType,
    colony,
    formValues: values,
  });

  if (!createdInDomain) {
    return null;
  }

  const payload = getActionPayload({
    actionType,
    formValues: values,
    colony,
    networkInverseFee,
  });

  if (!payload) {
    return null;
  }

  return {
    ...payload,
    createdInDomain,
    stakeAmount: BigNumber.from(stakeAmount),
    stakedExpenditureAddress,
    tokenAddress: colony.nativeToken.tokenAddress,
    activeBalance,
    customActionTitle: values?.title,
  };
};
