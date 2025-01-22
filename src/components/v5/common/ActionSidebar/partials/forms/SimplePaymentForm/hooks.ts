import { Id } from '@colony/colony-js';
import { useMemo } from 'react';
import { array, type InferType, number, object, string } from 'yup';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useNetworkInverseFee from '~hooks/useNetworkInverseFee.ts';
import useTokenLockStates from '~hooks/useTokenLockStates.ts';
import { ActionTypes } from '~redux/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { mapPayload, pipe } from '~utils/actions.ts';
import getLastIndexFromPath from '~utils/getLastIndexFromPath.ts';
import { formatText } from '~utils/intl.ts';
import { toFinite } from '~utils/lodash.ts';
import { removeCacheEntry, CacheQueryKeys } from '~utils/queries.ts';
import { shouldPreventPaymentsWithTokenInColony } from '~utils/tokens.ts';
import { amountGreaterThanZeroValidation } from '~utils/validation/amountGreaterThanZeroValidation.ts';
import { hasEnoughFundsValidation } from '~utils/validation/hasEnoughFundsValidation.ts';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts.ts';
import { type UseFormOptionsReturn } from '~v5/common/ActionSidebar/hooks/useActionForm.ts';

import { getSimplePaymentPayload } from './utils.tsx';

const useValidationSchema = (networkInverseFee: string | undefined) => {
  const { colony } = useColonyContext();
  const tokenLockStatesMap = useTokenLockStates();

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
                  domainId: context.parent.from,
                  colony,
                  networkInverseFee,
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
          createdIn: number().defined(),
          recipient: string().address().required(),
          from: number().required(),
          decisionMethod: string().defined(),
          payments: array()
            .of(
              object()
                .shape({
                  recipient: string().required(),
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
            )
            .required(),
        })
        .defined()
        .concat(ACTION_BASE_VALIDATION_SCHEMA),
    [colony, networkInverseFee, tokenLockStatesMap],
  );

  return validationSchema;
};

export type SimplePaymentFormValues = InferType<
  ReturnType<typeof useValidationSchema>
>;

export const useFormOptions =
  (): UseFormOptionsReturn<SimplePaymentFormValues> => {
    const { networkInverseFee } = useNetworkInverseFee();
    const { colony } = useColonyContext();
    const validationSchema = useValidationSchema(networkInverseFee);

    return useMemo(
      () => ({
        async actionType(formValues: SimplePaymentFormValues) {
          return formValues.decisionMethod === DecisionMethod.Permissions
            ? ActionTypes.ACTION_EXPENDITURE_PAYMENT
            : ActionTypes.MOTION_EXPENDITURE_PAYMENT;
        },
        validationSchema,
        defaultValues: {
          createdIn: Id.RootDomain,
          payments: [],
          tokenAddress: colony.nativeToken.tokenAddress,
        },
        transform: pipe(
          mapPayload((values: SimplePaymentFormValues) => {
            return getSimplePaymentPayload(colony, values, networkInverseFee);
          }),
        ),
        onSuccess(formValues) {
          /**
           * We need to remove all getDomainBalance queries once a payment has been successfully completed
           * By default it will refetch all active queries
           */
          if (formValues.decisionMethod === DecisionMethod.Permissions) {
            removeCacheEntry(CacheQueryKeys.GetDomainBalance);
          }
        },
      }),
      [colony, networkInverseFee, validationSchema],
    );
  };
