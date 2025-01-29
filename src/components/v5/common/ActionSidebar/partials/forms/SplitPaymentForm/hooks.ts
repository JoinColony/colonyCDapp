import { Id } from '@colony/colony-js';
import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { array, type InferType, number, object, string } from 'yup';

import { Action } from '~constants/actions.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { SplitPaymentDistributionType } from '~gql';
import useNetworkInverseFee from '~hooks/useNetworkInverseFee.ts';
import useTokenLockStates from '~hooks/useTokenLockStates.ts';
import { ActionTypes } from '~redux/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { mapPayload } from '~utils/actions.ts';
import { notNull } from '~utils/arrays/index.ts';
import getLastIndexFromPath from '~utils/getLastIndexFromPath.ts';
import { formatText } from '~utils/intl.ts';
import { shouldPreventPaymentsWithTokenInColony } from '~utils/tokens.ts';
import { amountGreaterThanZeroValidation } from '~utils/validation/amountGreaterThanZeroValidation.ts';
import { hasEnoughFundsValidation } from '~utils/validation/hasEnoughFundsValidation.ts';
import {
  ACTION_BASE_VALIDATION_SCHEMA,
  DECISION_METHOD_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import useActionFormBaseHook from '~v5/common/ActionSidebar/hooks/useActionFormBaseHook.ts';
import { useShowCreateStakedExpenditureModal } from '~v5/common/ActionSidebar/partials/CreateStakedExpenditureModal/hooks.tsx';
import { type ActionFormBaseProps } from '~v5/common/ActionSidebar/types.ts';

import {
  getSplitPaymentPayload,
  getUnevenSplitPaymentTotalPercentage,
} from './utils.ts';

export const useValidationSchema = () => {
  const { colony } = useColonyContext();
  const { watch } = useFormContext();
  const selectedTeam = watch('team');

  const tokenLockStatesMap = useTokenLockStates();

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
            formatText({ id: 'errors.amount.notEnoughTokens' }),
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
            formatText({ id: 'errors.amount.tokenIsLocked' }),
            (value) =>
              !shouldPreventPaymentsWithTokenInColony(
                value || '',
                colony,
                tokenLockStatesMap,
              ),
          ),
        createdIn: number().defined().required(),
        team: number()
          .required()
          .typeError(formatText({ id: 'errors.domain' })),
        decisionMethod: string().required(
          formatText({ id: 'errors.decisionMethod.required' }),
        ),
        distributionMethod: string()
          .test(
            'is-defined',
            formatText({ id: 'errors.distributionMethod.defined' }),
            (value) => value !== undefined,
          )
          .required(),
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
                    { id: 'errors.recipient.requiredIn' },
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
                tokenAddress: string()
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
              })
              .defined()
              .required(),
          )
          .test(
            'sum',
            formatText({ id: 'errors.sumOfPercentageMustBe100' }) || '',
            (value, context) => {
              const { parent } = context;
              const distributionMethod = parent?.distributionMethod;

              if (!value || !value.length) {
                return false;
              }

              if (
                !distributionMethod ||
                distributionMethod === SplitPaymentDistributionType.Equal ||
                distributionMethod === SplitPaymentDistributionType.Reputation
              ) {
                return true;
              }

              const percentage = getUnevenSplitPaymentTotalPercentage(
                Number(parent?.amount || 0),
                value,
              );

              return percentage === 100;
            },
          )
          .test(
            'is-defined',
            formatText({ id: 'errors.payments.defined' }),
            (value) => value !== undefined,
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

  const {
    renderStakedExpenditureModal,
    showStakedExpenditureModal,
    shouldShowStakedExpenditureModal,
  } = useShowCreateStakedExpenditureModal(Action.SplitPayment);

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
    primaryButton: {
      type: shouldShowStakedExpenditureModal ? 'button' : 'submit',
      onClick: showStakedExpenditureModal,
    },
  });

  return {
    currentToken,
    distributionMethod,
    renderStakedExpenditureModal,
  };
};
