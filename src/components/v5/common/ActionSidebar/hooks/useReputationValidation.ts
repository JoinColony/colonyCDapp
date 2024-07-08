import { Id } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { boolean, object } from 'yup';

import { ADDRESS_ZERO } from '~constants/index.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { SplitPaymentDistributionType, useGetUserReputationQuery } from '~gql';
import { DecisionMethod } from '~types/actions.ts';

import { REPUTATION_VALIDATION_FIELD_NAME } from '../consts.ts';

export const reputationValidationSchema = object()
  .shape({
    [REPUTATION_VALIDATION_FIELD_NAME]: boolean().oneOf(
      [false],
      // @NOTE: This message will not be shown in the UI
      'No reputation in team',
    ),
  })
  .defined();

const useReputationValidation = () => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const {
    watch,
    setValue,
    formState: {
      errors: { [REPUTATION_VALIDATION_FIELD_NAME]: fieldError },
      isSubmitted,
    },
  } = useFormContext();

  const formValues = watch();
  const {
    [REPUTATION_VALIDATION_FIELD_NAME]: fieldValue,
    createdIn,
    decisionMethod,
    distributionMethod,
  } = formValues;

  const createdInDomainId = createdIn ? Number(createdIn) : Id.RootDomain;
  const { data } = useGetUserReputationQuery({
    variables: {
      input: {
        walletAddress: ADDRESS_ZERO,
        colonyAddress,
        domainId: createdInDomainId,
      },
    },
  });
  const isReputationDistributionMethodSelected =
    distributionMethod &&
    distributionMethod === SplitPaymentDistributionType.Reputation;
  const domainReputation = BigNumber.from(data?.getUserReputation ?? 0);
  const isMissingReputation =
    domainReputation.isZero() &&
    (decisionMethod === DecisionMethod.Reputation ||
      isReputationDistributionMethodSelected);

  useEffect(() => {
    if (fieldValue !== isMissingReputation) {
      setValue(REPUTATION_VALIDATION_FIELD_NAME, isMissingReputation, {
        shouldValidate: true,
      });
    }
  }, [fieldValue, isMissingReputation, setValue]);

  const hasError = !!fieldError;

  return {
    noReputationError: isReputationDistributionMethodSelected
      ? hasError
      : hasError && isSubmitted,
  };
};

export default useReputationValidation;
