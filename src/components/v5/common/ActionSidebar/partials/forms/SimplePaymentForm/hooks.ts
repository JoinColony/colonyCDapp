import { Id } from '@colony/colony-js';
import { useCallback, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { type DeepPartial } from 'utility-types';
import { array, type InferType, number, object, string } from 'yup';

import { useColonyContext } from '~context/ColonyContext.tsx';
import useNetworkInverseFee from '~hooks/useNetworkInverseFee.ts';
import { ActionTypes } from '~redux/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { mapPayload, pipe } from '~utils/actions.ts';
import getLastIndexFromPath from '~utils/getLastIndexFromPath.ts';
import { formatText } from '~utils/intl.ts';
import { toFinite } from '~utils/lodash.ts';
import { hasEnoughFundsValidation } from '~utils/validation/hasEnoughFundsValidation.ts';
import {
  ACTION_BASE_VALIDATION_SCHEMA,
  DECISION_METHOD_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.tsx';

import { useActionFormBaseHook } from '../../../hooks/index.ts';
import { type ActionFormBaseProps } from '../../../types.ts';

import { getSimplePaymentPayload } from './utils.tsx';

export const useValidationSchema = () => {
  const { colony } = useColonyContext();
  const { watch } = useFormContext();
  const selectedTeam: string | undefined = watch('from');

  const validationSchema = useMemo(
    () =>
      object()
        .shape({
          amount: object()
            .shape({
              amount: number()
                .required(() => formatText({ id: 'errors.amount' }))
                .transform((value) => toFinite(value))
                .moreThan(0, () =>
                  formatText({ id: 'errors.amount.greaterThanZero' }),
                )
                .test(
                  'enough-tokens',
                  formatText({ id: 'errors.amount.notEnoughTokens' }) || '',
                  (value, context) =>
                    hasEnoughFundsValidation(
                      value,
                      context,
                      selectedTeam,
                      colony,
                    ),
                ),
              tokenAddress: string().address().required(),
            })
            .required()
            .defined(),
          createdIn: number().defined(),
          recipient: string().address().required(),
          from: number().required(),
          decisionMethod: string().defined(),
          payments: array()
            .of(
              object()
                .shape({
                  recipient: string().required(),
                  amount: object()
                    .shape({
                      amount: number()
                        .required(() => formatText({ id: 'errors.amount' }))
                        .transform((value) => toFinite(value))
                        .moreThan(0, ({ path }) => {
                          const index = getLastIndexFromPath(path);

                          if (index === undefined) {
                            return formatText({ id: 'errors.amount' });
                          }

                          return formatText(
                            { id: 'errors.payments.amount' },
                            { paymentIndex: index + 1 },
                          );
                        }),
                    })
                    .required(),
                })
                .required(),
            )
            .required(),
        })
        .defined()
        .concat(ACTION_BASE_VALIDATION_SCHEMA),
    [colony, selectedTeam],
  );

  return validationSchema;
};

export type SimplePaymentFormValues = InferType<
  ReturnType<typeof useValidationSchema>
>;

export const useSimplePayment = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { networkInverseFee } = useNetworkInverseFee();
  const { colony } = useColonyContext();
  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });
  const selectedTokenAddress: string = useWatch({
    name: 'amount.tokenAddress',
  });
  const validationSchema = useValidationSchema();

  useActionFormBaseHook({
    validationSchema,
    defaultValues: useMemo<DeepPartial<SimplePaymentFormValues>>(
      () => ({
        createdIn: Id.RootDomain,
        payments: [],
        amount: {
          tokenAddress: selectedTokenAddress ?? colony.nativeToken.tokenAddress,
        },
      }),
      [selectedTokenAddress, colony.nativeToken.tokenAddress],
    ),
    actionType:
      decisionMethod === DecisionMethod.Permissions
        ? ActionTypes.ACTION_EXPENDITURE_PAYMENT
        : ActionTypes.MOTION_EXPENDITURE_PAYMENT,
    getFormOptions,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((values: SimplePaymentFormValues) => {
          return getSimplePaymentPayload(colony, values, networkInverseFee);
        }),
      ),
      [colony, networkInverseFee],
    ),
  });
};
