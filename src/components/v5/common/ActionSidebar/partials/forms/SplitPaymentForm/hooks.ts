import { Id } from '@colony/colony-js';
import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { array, InferType, number, object, string } from 'yup';

import { useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import { mapPayload } from '~utils/actions';
import { notNull } from '~utils/arrays';
import { formatText } from '~utils/intl';
import { toFinite } from '~utils/lodash';
import { hasEnoughFundsValidation } from '~utils/validation/hasEnoughFundsValidation';
import {
  ACTION_BASE_VALIDATION_SCHEMA,
  DECISION_METHOD_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts';

import { DecisionMethod, useActionFormBaseHook } from '../../../hooks';
import { ActionFormBaseProps } from '../../../types';

export const useValidationSchema = () => {
  const { colony } = useColonyContext();
  const { watch } = useFormContext();
  const selectedTeam = watch('team');

  const validationSchema = useMemo(
    () =>
      object({
        amount: object({
          amount: number()
            .required(() => formatText({ id: 'validation.required' }))
            .transform((value) => toFinite(value))
            .moreThan(0, () =>
              formatText({ id: 'errors.amount.greaterThanZero' }),
            )
            .test(
              'enough-tokens',
              formatText({ id: 'errors.amount.notEnoughTokens' }) || '',
              (value, context) =>
                hasEnoughFundsValidation(value, context, selectedTeam, colony),
            ),
          tokenAddress: string().address().required(),
        }).required(),
        createdIn: number().defined(),
        team: number().required(),
        decisionMethod: string().defined(),
        distributionMethod: string().defined(),
        payments: array(
          object().shape({
            percent: number().required(),
            recipient: string().required(),
          }),
        )
          .test(
            'sum',
            formatText({ id: 'errors.sumOfPercentageMustBe100' }) || '',
            (value) => {
              if (!value) {
                return false;
              }

              const sum = value.reduce(
                (acc, curr) => acc + (curr?.percent || 0),
                0,
              );

              return sum === 100;
            },
          )
          .required(),
      })
        .defined()
        .concat(ACTION_BASE_VALIDATION_SCHEMA),
    [colony, selectedTeam],
  );

  return validationSchema;
};

export type SplitPaymentFormValues = InferType<
  ReturnType<typeof useValidationSchema>
>;

export const useSplitPayment = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });
  const { colony } = useColonyContext();
  const colonyTokens = useMemo(
    () =>
      colony.tokens?.items
        .filter(notNull)
        .map((colonyToken) => colonyToken.token) || [],
    [colony.tokens?.items],
  );
  const amount = useWatch({ name: 'amount' });
  const currentToken = useMemo(
    () =>
      colonyTokens.find(
        (token) => token?.tokenAddress === amount?.tokenAddress,
      ),
    [amount?.tokenAddress, colonyTokens],
  );
  const distributionMethod = useWatch({ name: 'distributionMethod' });
  const validationSchema = useValidationSchema();

  useActionFormBaseHook({
    validationSchema,
    defaultValues: useMemo(
      () => ({
        amount: {
          tokenAddress: colony.nativeToken.tokenAddress,
        },
        createdIn: Id.RootDomain,
        payments: [
          {
            percent: 0,
          },
        ],
      }),
      [colony.nativeToken.tokenAddress],
    ),
    actionType:
      decisionMethod === DecisionMethod.Permissions
        ? ActionTypes.ACTION_EXPENDITURE_PAYMENT
        : ActionTypes.MOTION_EXPENDITURE_PAYMENT,
    getFormOptions,
    transform: mapPayload((payload: SplitPaymentFormValues) => {
      // @TODO: Add a helper function mapping form values to action payload
      return payload;
    }),
  });

  return {
    currentToken,
    amount: Number(amount?.amount || 0),
    distributionMethod,
  };
};
