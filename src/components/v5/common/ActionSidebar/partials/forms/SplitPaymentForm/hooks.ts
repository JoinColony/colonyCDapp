import { Id } from '@colony/colony-js';
import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { array, type InferType, number, object, string } from 'yup';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { SplitPaymentDistributionType } from '~gql';
import useNetworkInverseFee from '~hooks/useNetworkInverseFee.ts';
import { ActionTypes } from '~redux/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { mapPayload } from '~utils/actions.ts';
import { notNull } from '~utils/arrays/index.ts';
import getLastIndexFromPath from '~utils/getLastIndexFromPath.ts';
import { formatText } from '~utils/intl.ts';
import { amountGreaterThanZeroValidation } from '~utils/validation/amountGreaterThanZeroValidation.ts';
import { hasEnoughFundsValidation } from '~utils/validation/hasEnoughFundsValidation.ts';
import {
  ACTION_BASE_VALIDATION_SCHEMA,
  DECISION_METHOD_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';

import useActionFormBaseHook from '../../../hooks/useActionFormBaseHook.ts';
import { type ActionFormBaseProps } from '../../../types.ts';

import { getSplitPaymentPayload } from './utils.ts';

export const useValidationSchema = () => {
  const { colony } = useColonyContext();
  const { watch } = useFormContext();
  const selectedTeam = watch('team');

  const validationSchema = useMemo(
    () =>
      object({
        amount: string()
          .required(() => formatText({ id: 'errors.amount' }))
          .test(
            'more-than-zero',
            ({ path }) => {
              const index = getLastIndexFromPath(path);
              if (index === undefined) {
                return formatText({
                  id: 'errors.amount.greaterThanZero',
                });
              }
              return formatText(
                { id: 'errors.amount.greaterThanZeroIn' },
                { paymentIndex: index + 1 },
              );
            },
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
        tokenAddress: string().address().required(),
        createdIn: number().defined().required(),
        team: number().required(),
        decisionMethod: string().defined().required(),
        distributionMethod: string().defined().required(),
        payments: array()
          .of(
            object()
              .shape({
                percent: number()
                  .required(({ path }) => {
                    const index = getLastIndexFromPath(path);

                    return formatText(
                      { id: 'errors.percent.required' },
                      { paymentIndex: index === undefined ? 1 : index + 1 },
                    );
                  })
                  .min(0)
                  .max(100, ({ path }) => {
                    const index = getLastIndexFromPath(path);

                    return formatText(
                      { id: 'errors.percent.lessOrEqual100' },
                      { paymentIndex: index === undefined ? 1 : index + 1 },
                    );
                  })
                  .test('decimals', 'Max 4 decimal places', (val) => {
                    if (!val) {
                      return true;
                    }

                    const value = val.toString().split('.');

                    const decimals =
                      value.length > 1 ? val.toString().split('.')[1] : '';

                    return decimals.length <= 4;
                  }),
                recipient: string().required(({ path }) => {
                  const index = getLastIndexFromPath(path);

                  return formatText(
                    { id: 'errors.recipient.required' },
                    { paymentIndex: index === undefined ? 1 : index + 1 },
                  );
                }),
                amount: string()
                  .required(formatText({ id: 'errors.amount' }))
                  .test(
                    'more-than-zero',
                    ({ path }) => {
                      const index = getLastIndexFromPath(path);
                      if (index === undefined) {
                        return formatText({
                          id: 'errors.amount.greaterThanZero',
                        });
                      }
                      return formatText(
                        { id: 'errors.amount.greaterThanZeroIn' },
                        { paymentIndex: index + 1 },
                      );
                    },
                    (value, context) =>
                      amountGreaterThanZeroValidation({
                        value,
                        context,
                        colony,
                      }),
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
                tokenAddress: string().required(),
              })
              .defined()
              .required(),
          )
          .test(
            'sum',
            formatText({ id: 'errors.sumOfPercentageMustBe100' }) || '',
            (value, context) => {
              const { parent } = context;
              const decisionMethod = parent?.decisionMethod;
              const distributionMethod = parent?.distributionMethod;
              if (!value) {
                return false;
              }

              if (
                !decisionMethod ||
                distributionMethod === SplitPaymentDistributionType.Equal ||
                distributionMethod === SplitPaymentDistributionType.Reputation
              ) {
                return true;
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
  const tokenAddress = useWatch({ name: 'tokenAddress' });
  const currentToken = useMemo(
    () => colonyTokens.find((token) => token?.tokenAddress === tokenAddress),
    [tokenAddress, colonyTokens],
  );
  const distributionMethod = useWatch({ name: 'distributionMethod' });
  const validationSchema = useValidationSchema();
  const { networkInverseFee = '0' } = useNetworkInverseFee();

  useActionFormBaseHook({
    validationSchema,
    defaultValues: useMemo(
      () => ({
        tokenAddress: colony.nativeToken.tokenAddress,
        createdIn: Id.RootDomain,
        payments: [
          {
            tokenAddress,
            percent: undefined,
          },
        ],
      }),
      [colony.nativeToken.tokenAddress, tokenAddress],
    ),
    actionType:
      decisionMethod === DecisionMethod.Permissions
        ? ActionTypes.EXPENDITURE_CREATE
        : ActionTypes.STAKED_EXPENDITURE_CREATE,
    getFormOptions,
    transform: mapPayload((payload: SplitPaymentFormValues) =>
      getSplitPaymentPayload(colony, payload, networkInverseFee),
    ),
  });

  return {
    currentToken,
    distributionMethod,
  };
};
