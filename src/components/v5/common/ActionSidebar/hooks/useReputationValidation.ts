import { Id } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { boolean, object } from 'yup';

import { ADDRESS_ZERO } from '~constants';
import { useGetUserReputationQuery } from '~gql';
import { useColonyContext } from '~hooks';

import { DecisionMethod } from './useDecisionMethods';

export const REPUTATION_VALIDATION_FIELD_NAME = 'isMissingReputation';

export const reputationValidationSchema = object()
  .shape({
    [REPUTATION_VALIDATION_FIELD_NAME]: boolean().oneOf(
      [false],
      // @NOTE: This message will not be shown in the UI
      'No reputation in team',
    ),
  })
  .defined();

export const useReputationValidation = () => {
  const { colony } = useColonyContext();
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
  } = formValues;

  const createdInDomainId = createdIn ? Number(createdIn) : Id.RootDomain;
  const { data } = useGetUserReputationQuery({
    skip: !colony?.colonyAddress,
    variables: {
      input: {
        walletAddress: ADDRESS_ZERO,
        colonyAddress: colony?.colonyAddress ?? '',
        domainId: createdInDomainId,
      },
    },
  });
  const domainReputation = BigNumber.from(data?.getUserReputation ?? 0);
  const isMissingReputation =
    domainReputation.isZero() && decisionMethod === DecisionMethod.Reputation;

  useEffect(() => {
    if (fieldValue !== isMissingReputation) {
      setValue(REPUTATION_VALIDATION_FIELD_NAME, isMissingReputation, {
        shouldValidate: true,
      });
    }
  }, [fieldValue, isMissingReputation, setValue]);

  return { noReputationError: !!fieldError && isSubmitted };
};
