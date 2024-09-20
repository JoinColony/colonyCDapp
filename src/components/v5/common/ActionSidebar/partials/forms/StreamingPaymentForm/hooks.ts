import { Id } from '@colony/colony-js';
import isDate from 'date-fns/isDate';
import { useCallback, useEffect, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { type DeepPartial } from 'utility-types';
import { type InferType, number, object, string, date, lazy, mixed } from 'yup';

import { ONE_DAY_IN_SECONDS } from '~constants/time.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { StreamingPaymentEndCondition } from '~gql';
import useCurrentBlockTime from '~hooks/useCurrentBlockTime.ts';
import useNetworkInverseFee from '~hooks/useNetworkInverseFee.ts';
import { ActionTypes } from '~redux/index.ts';
import { mapPayload, pipe } from '~utils/actions.ts';
import getLastIndexFromPath from '~utils/getLastIndexFromPath.ts';
import { formatText } from '~utils/intl.ts';
import { amountGreaterThanValidation } from '~utils/validation/amountGreaterThanValidation.ts';
import { amountGreaterThanZeroValidation } from '~utils/validation/amountGreaterThanZeroValidation.ts';
import { hasEnoughFundsValidation } from '~utils/validation/hasEnoughFundsValidation.ts';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts.ts';
import useActionFormBaseHook from '~v5/common/ActionSidebar/hooks/useActionFormBaseHook.ts';
import { AmountPerInterval } from '~v5/common/ActionSidebar/partials/AmountPerPeriodRow/types.ts';
import { type ActionFormBaseProps } from '~v5/common/ActionSidebar/types.ts';

import { getStreamingPaymentPayload } from './utils.ts';

export const useValidationSchema = (networkInverseFee: string | undefined) => {
  const { colony } = useColonyContext();
  const fromDomainId: number | undefined = useWatch({ name: 'from' });
  const amount: string | undefined = useWatch({ name: 'amount' });

  const validationSchema = useMemo(
    () =>
      object()
        .shape({
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
                  domainId: fromDomainId,
                  colony,
                  networkInverseFee,
                }),
            ),
          tokenAddress: string().address().required(),
          limitTokenAddress: string().address(),
          limit: string().when('ends', {
            is: StreamingPaymentEndCondition.LimitReached,
            then: string()
              .required(() => formatText({ id: 'errors.amount' }))
              .test(
                'more-than-amount',
                () => {
                  return formatText(
                    { id: 'errors.amount.greaterThan' },
                    { amount: amount || '0' },
                  );
                },
                (value, context) =>
                  amountGreaterThanValidation({
                    value,
                    context,
                    colony,
                    greaterThanValue: context.parent.amount || '0',
                  }),
              ),
          }),
          createdIn: number().defined(),
          recipient: string().address().required(),
          from: number().required(),
          starts: lazy((value) =>
            isDate(value) ? date().required() : string().required(),
          ),
          ends: lazy((value) =>
            isDate(value)
              ? date().required()
              : mixed<StreamingPaymentEndCondition>()
                  .oneOf(Object.values(StreamingPaymentEndCondition))
                  .required(),
          ),
          decisionMethod: string().defined(),
          period: object()
            .shape({
              interval: mixed<AmountPerInterval>()
                .oneOf(Object.values(AmountPerInterval))
                .required(() =>
                  formatText({ id: 'errors.amountPer.required' }),
                ),
              custom: number().when('interval', {
                is: AmountPerInterval.Custom,
                then: (schema) =>
                  schema
                    .min(
                      ONE_DAY_IN_SECONDS,
                      formatText({ id: 'errors.amountPer.min' }),
                    )
                    .max(
                      ONE_DAY_IN_SECONDS * 99999,
                      formatText(
                        { id: 'errors.amountPer.max' },
                        { max: '99999 days' },
                      ),
                    )
                    .required(),
              }),
            })
            .required(),
        })
        .defined()
        .concat(ACTION_BASE_VALIDATION_SCHEMA),
    [amount, colony, fromDomainId, networkInverseFee],
  );

  return validationSchema;
};

export type StreamingPaymentFormValues = InferType<
  ReturnType<typeof useValidationSchema>
>;

export const useStreamingPayment = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { networkInverseFee } = useNetworkInverseFee();
  const { colony } = useColonyContext();
  const validationSchema = useValidationSchema(networkInverseFee);
  const tokenAddress = useWatch({ name: 'tokenAddress' });
  const limitTokenAddress = useWatch({ name: 'limitTokenAddress' });
  const endCondition = useWatch({ name: 'ends' });
  const { setValue, resetField, trigger } = useFormContext();
  const { currentBlockTime: blockTime } = useCurrentBlockTime();

  useEffect(() => {
    if (
      tokenAddress &&
      tokenAddress !== limitTokenAddress &&
      endCondition === StreamingPaymentEndCondition.LimitReached
    ) {
      setValue('limitTokenAddress', tokenAddress);
    }
  }, [endCondition, limitTokenAddress, setValue, tokenAddress]);

  useEffect(() => {
    if (
      limitTokenAddress &&
      endCondition !== StreamingPaymentEndCondition.LimitReached
    ) {
      trigger('limit');
      resetField('limit');
    }
  }, [endCondition, limitTokenAddress, resetField, trigger]);

  useActionFormBaseHook({
    validationSchema,
    defaultValues: useMemo<DeepPartial<StreamingPaymentFormValues>>(
      () => ({
        createdIn: Id.RootDomain,
        tokenAddress: colony.nativeToken.tokenAddress,
        period: {
          custom: ONE_DAY_IN_SECONDS * 30,
        },
      }),
      [colony.nativeToken.tokenAddress],
    ),
    actionType: ActionTypes.STREAMING_PAYMENT_CREATE,
    getFormOptions,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((values: StreamingPaymentFormValues) => {
          return getStreamingPaymentPayload(colony, values, blockTime);
        }),
      ),
      [colony, networkInverseFee],
    ),
  });
};
