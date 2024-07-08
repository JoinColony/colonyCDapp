import { Id } from '@colony/colony-js';
import { useCallback, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { type DeepPartial } from 'utility-types';
import { type InferType, number, object, string } from 'yup';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useTokenLockStates from '~hooks/useTokenLockStates.ts';
import { ActionTypes } from '~redux/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { mapPayload, pipe } from '~utils/actions.ts';
import { formatText } from '~utils/intl.ts';
import { removeCacheEntry, CacheQueryKeys } from '~utils/queries.ts';
import { shouldPreventPaymentsWithTokenInColony } from '~utils/tokens.ts';
import { amountGreaterThanZeroValidation } from '~utils/validation/amountGreaterThanZeroValidation.ts';
import { hasEnoughFundsValidation } from '~utils/validation/hasEnoughFundsValidation.ts';
import {
  ACTION_BASE_VALIDATION_SCHEMA,
  DECISION_METHOD_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import useActionFormBaseHook from '~v5/common/ActionSidebar/hooks/useActionFormBaseHook.ts';
import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';

import { getTransferFundsPayload } from './utils.tsx';

export const useValidationSchema = () => {
  const { colony } = useColonyContext();
  const { watch } = useFormContext();
  const selectedTeam = watch('from');
  const tokenLockStatesMap = useTokenLockStates();

  const validationSchema = useMemo(
    () =>
      object()
        .shape({
          amount: string()
            .required(() => formatText({ id: 'errors.amount' }))
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
          createdIn: number().defined(),
          from: number().required(),
          to: number()
            .required()
            .when('from', (from, schema) =>
              schema.notOneOf(
                [from],
                formatText({ id: 'errors.cantMoveToTheSameTeam' }),
              ),
            ),
          decisionMethod: string().defined(),
        })
        .defined()
        .concat(ACTION_BASE_VALIDATION_SCHEMA),
    [colony, selectedTeam, tokenLockStatesMap],
  );

  return validationSchema;
};

export type TransferFundsFormValues = InferType<
  ReturnType<typeof useValidationSchema>
>;

export const useTransferFunds = (
  getFormOptions: CreateActionFormProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const { [DECISION_METHOD_FIELD_NAME]: decisionMethod } = useWatch<{
    decisionMethod: DecisionMethod;
  }>();

  const validationSchema = useValidationSchema();

  useActionFormBaseHook({
    validationSchema,
    defaultValues: useMemo<DeepPartial<TransferFundsFormValues>>(
      () => ({
        createdIn: Id.RootDomain,
        tokenAddress: colony.nativeToken.tokenAddress,
      }),
      [colony.nativeToken.tokenAddress],
    ),
    actionType:
      decisionMethod === DecisionMethod.Permissions
        ? ActionTypes.ACTION_MOVE_FUNDS
        : ActionTypes.MOTION_MOVE_FUNDS,
    getFormOptions,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((values: TransferFundsFormValues) => {
          return getTransferFundsPayload(colony, values);
        }),
      ),
      [colony],
    ),
    onSuccess: () => {
      /**
       * We need to remove all getDomainBalance queries once a payment has been successfully completed
       * By default it will refetch all active queries
       */
      if (decisionMethod === DecisionMethod.Permissions) {
        removeCacheEntry(CacheQueryKeys.GetDomainBalance);
      }
    },
  });
};
