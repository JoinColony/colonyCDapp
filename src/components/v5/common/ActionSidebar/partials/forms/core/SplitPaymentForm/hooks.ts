import { Id } from '@colony/colony-js';
import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { array, type InferType, number, object, string } from 'yup';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { DecisionMethod } from '~gql';
import useTokenLockStates from '~hooks/useTokenLockStates.ts';
import { ActionTypes } from '~redux/index.ts';
import { mapPayload } from '~utils/actions.ts';
import { notNull } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import { shouldPreventPaymentsWithTokenInColony } from '~utils/tokens.ts';
import { amountGreaterThanZeroValidation } from '~utils/validation/amountGreaterThanZeroValidation.ts';
import { hasEnoughFundsValidation } from '~utils/validation/hasEnoughFundsValidation.ts';
import {
  ACTION_BASE_VALIDATION_SCHEMA,
  DECISION_METHOD_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import useActionFormBaseHook from '~v5/common/ActionSidebar/hooks/useActionFormBaseHook.ts';
import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';

export const useValidationSchema = () => {
  const { colony } = useColonyContext();
  const { watch } = useFormContext();
  const selectedTeam = watch('team');
  const tokenLockStatesMap = useTokenLockStates();

  const validationSchema = useMemo(
    () =>
      object({
        amount: object({
          amount: string()
            .required(() => formatText({ id: 'validation.required' }))
            .test(
              'more-than-zero',
              formatText({
                id: 'errors.amount.greaterThanZero',
              }),
              (value, context) =>
                amountGreaterThanZeroValidation({ value, context, colony }),
            )
            .test(
              'enough-tokens',
              formatText({ id: 'errors.amount.notEnoughTokens' }) || '',
              (value, context) =>
                hasEnoughFundsValidation({
                  value,
                  context,
                  domainId: selectedTeam,
                  colony,
                }),
            ),
          tokenAddress: string()
            .address()
            .required()
            .test(
              'token-unlocked',
              formatText({ id: 'errors.amount.tokenIsLocked' }) || '',
              (value) =>
                !shouldPreventPaymentsWithTokenInColony(
                  value || '',
                  colony,
                  tokenLockStatesMap,
                ),
            ),
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
    [colony, selectedTeam, tokenLockStatesMap],
  );

  return validationSchema;
};

export type SplitPaymentFormValues = InferType<
  ReturnType<typeof useValidationSchema>
>;

export const useSplitPayment = (
  getFormOptions: CreateActionFormProps['getFormOptions'],
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
