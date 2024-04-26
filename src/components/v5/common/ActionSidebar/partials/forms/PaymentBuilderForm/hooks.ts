import { Id } from '@colony/colony-js';
import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { type DeepPartial } from 'utility-types';
import { array, type InferType, number, object, string } from 'yup';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useNetworkInverseFee from '~hooks/useNetworkInverseFee.ts';
import { ActionTypes } from '~redux/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { mapPayload } from '~utils/actions.ts';
import { notNull } from '~utils/arrays/index.ts';
import getLastIndexFromPath from '~utils/getLastIndexFromPath.ts';
import { formatText } from '~utils/intl.ts';
import { amountGreaterThanZeroValidation } from '~utils/validation/amountGreaterThanZeroValidation.ts';
import {
  ACTION_BASE_VALIDATION_SCHEMA,
  DECISION_METHOD_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';

import useActionFormBaseHook from '../../../hooks/useActionFormBaseHook.ts';
import { type ActionFormBaseProps } from '../../../types.ts';

import {
  allTokensAmountValidation,
  getPaymentBuilderPayload,
} from './utils.tsx';

export const useValidationSchema = () => {
  const { colony } = useColonyContext();
  const colonyTokens = useMemo(
    () =>
      colony.tokens?.items
        .filter(notNull)
        .map((colonyToken) => colonyToken.token) || [],
    [colony.tokens?.items],
  );

  return useMemo(
    () =>
      object()
        .shape({
          from: number().required(
            formatText({ id: 'errors.fundFrom.required' }),
          ),
          decisionMethod: string().defined(),
          createdIn: number().defined(),
          payments: array()
            .of(
              object()
                .shape({
                  recipient: string()
                    .required(({ path }) => {
                      const index = getLastIndexFromPath(path);
                      if (index === undefined) {
                        return formatText({ id: 'errors.amount' });
                      }
                      return formatText(
                        { id: 'errors.recipient.required' },
                        { paymentIndex: index + 1 },
                      );
                    })
                    .address(),
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
                        amountGreaterThanZeroValidation(value, context, colony),
                    )
                    .test('tokens-sum-exceeded', '', (value, context) =>
                      allTokensAmountValidation(value, context, colony),
                    ),
                  tokenAddress: string().address().required(),
                  delay: number()
                    .max(99999, ({ path }) => {
                      const index = getLastIndexFromPath(path);
                      if (index === undefined) {
                        return formatText(
                          {
                            id: 'errors.amount.smallerThan',
                          },
                          {
                            max: 99999,
                          },
                        );
                      }
                      return formatText(
                        { id: 'errors.amount.smallerThanIn' },
                        { paymentIndex: index + 1, max: 99999 },
                      );
                    })
                    .defined(),
                })
                .defined()
                .required(),
            )
            .defined()
            .required(),
        })
        .test(
          'is-in-colony',
          formatText({ id: 'actionSidebar.tokenAddress.error' }),
          (item) => {
            const { payments } = item || {};

            if (!payments) {
              return false;
            }

            return payments.every((payment) => {
              return colonyTokens.some(
                (colonyToken) =>
                  colonyToken.tokenAddress === payment.tokenAddress,
              );
            });
          },
        )
        .defined()
        .concat(ACTION_BASE_VALIDATION_SCHEMA),
    [colony, colonyTokens],
  );
};

export type PaymentBuilderFormValues = InferType<
  ReturnType<typeof useValidationSchema>
>;

export const usePaymentBuilder = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const { nativeToken } = colony;
  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });
  const validationSchema = useValidationSchema();
  const { networkInverseFee = '0' } = useNetworkInverseFee();

  useActionFormBaseHook({
    validationSchema,
    defaultValues: useMemo<DeepPartial<PaymentBuilderFormValues>>(
      () => ({
        createdIn: Id.RootDomain,
        payments: [
          {
            tokenAddress: nativeToken.tokenAddress,
          },
        ],
      }),
      [nativeToken.tokenAddress],
    ),
    actionType:
      decisionMethod === DecisionMethod.Permissions
        ? ActionTypes.EXPENDITURE_CREATE
        : ActionTypes.STAKED_EXPENDITURE_CREATE,
    getFormOptions: (formOptions, form) =>
      getFormOptions(
        {
          ...formOptions,
          mode: 'onSubmit',
          reValidateMode: 'onSubmit',
          actionType:
            decisionMethod === DecisionMethod.Permissions
              ? ActionTypes.EXPENDITURE_CREATE
              : ActionTypes.STAKED_EXPENDITURE_CREATE,
        },
        form,
      ),
    transform: mapPayload((payload: PaymentBuilderFormValues) => {
      return getPaymentBuilderPayload(colony, payload, networkInverseFee);
    }),
  });
};
