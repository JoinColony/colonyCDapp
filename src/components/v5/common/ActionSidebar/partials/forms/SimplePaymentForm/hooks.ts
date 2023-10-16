import { useCallback, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Id } from '@colony/colony-js';
import { DeepPartial } from 'utility-types';
import { array, InferType, number, object, string } from 'yup';

import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { useColonyContext, useNetworkInverseFee } from '~hooks';
import { getCreatePaymentDialogPayload } from '~common/Dialogs/CreatePaymentDialog/helpers';
import { formatText } from '~utils/intl';
import { toFinite } from '~utils/lodash';
import { MAX_ANNOTATION_LENGTH } from '~constants';
import getLastIndexFromPath from '~utils/getLastIndexFromPath';
import { hasEnoughFundsValidation } from '~utils/validation/hasEnoughFundsValidation';
import {
  ACTION_BASE_VALIDATION_SCHEMA,
  DECISION_METHOD_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts';

import { ActionFormBaseProps } from '../../../types';
import { DecisionMethod, useActionFormBaseHook } from '../../../hooks';

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
          createdIn: string().defined(),
          description: string().max(MAX_ANNOTATION_LENGTH).notRequired(),
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
        createdIn: Id.RootDomain.toString(),
        payments: [],
        amount: {
          tokenAddress:
            selectedTokenAddress ?? colony?.nativeToken.tokenAddress,
        },
      }),
      [selectedTokenAddress, colony?.nativeToken.tokenAddress],
    ),
    actionType:
      decisionMethod === DecisionMethod.Permissions
        ? ActionTypes.ACTION_EXPENDITURE_PAYMENT
        : ActionTypes.MOTION_EXPENDITURE_PAYMENT,
    getFormOptions,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((payload: SimplePaymentFormValues) => {
          if (!colony) {
            return null;
          }

          return getCreatePaymentDialogPayload(
            colony,
            {
              fromDomainId: payload.from,
              payments: [
                {
                  amount: payload.amount.amount,
                  tokenAddress: payload.amount.tokenAddress,
                  recipient: { walletAddress: payload.recipient },
                },
                ...payload.payments.map(({ amount, recipient }) => ({
                  amount: amount.amount,
                  tokenAddress: payload.amount.tokenAddress,
                  recipient: { walletAddress: recipient },
                })),
              ],
              annotation: payload.description,
              motionDomainId: payload.createdIn,
            },
            networkInverseFee,
          );
        }),
      ),
      [colony, networkInverseFee],
    ),
  });

  return {
    selectedTokenAddress,
  };
};
