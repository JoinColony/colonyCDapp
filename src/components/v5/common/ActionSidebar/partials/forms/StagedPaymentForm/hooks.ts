import { Id } from '@colony/colony-js';
import { useMemo } from 'react';
import { type DeepPartial } from 'utility-types';
import { type InferType, array, number, object, string } from 'yup';

import { MAX_MILESTONE_LENGTH } from '~constants';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import { ExpenditureType } from '~gql';
import useNetworkInverseFee from '~hooks/useNetworkInverseFee.ts';
import { ActionTypes } from '~redux';
import { mapPayload } from '~utils/actions.ts';
import { notNull } from '~utils/arrays/index.ts';
import getLastIndexFromPath from '~utils/getLastIndexFromPath.ts';
import { formatText } from '~utils/intl.ts';
import { amountGreaterThanZeroValidation } from '~utils/validation/amountGreaterThanZeroValidation.ts';
import {
  ACTION_BASE_VALIDATION_SCHEMA,
  DECISION_METHOD_FIELD_NAME,
  AMOUNT_FIELD_NAME,
  TOKEN_FIELD_NAME,
  CREATED_IN_FIELD_NAME,
  RECIPIENT_FIELD_NAME,
  FROM_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import useActionFormBaseHook from '~v5/common/ActionSidebar/hooks/useActionFormBaseHook.ts';
import { type ActionFormBaseProps } from '~v5/common/ActionSidebar/types.ts';

import { allTokensAmountValidation } from '../PaymentBuilderForm/utils.ts';

import { getStagedPaymentPayload } from './utils.ts';

export const useValidationSchema = (networkInverseFee: string | undefined) => {
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
          [RECIPIENT_FIELD_NAME]: string()
            .required(({ path }) => {
              const index = getLastIndexFromPath(path);
              if (index === undefined) {
                return formatText({ id: 'errors.recipient.required' });
              }
              return formatText(
                { id: 'errors.recipient.requiredIn' },
                { paymentIndex: index + 1 },
              );
            })
            .address(),
          [FROM_FIELD_NAME]: number().required(
            formatText({ id: 'errors.fundFrom.required' }),
          ),
          [DECISION_METHOD_FIELD_NAME]: string().defined(),
          [CREATED_IN_FIELD_NAME]: number().defined(),
          stages: array()
            .of(
              object()
                .shape({
                  milestone: string()
                    .trim()
                    .max(MAX_MILESTONE_LENGTH, ({ path }) => {
                      const index = getLastIndexFromPath(path);
                      if (index === undefined) {
                        return formatText({ id: 'too.many.characters' });
                      }
                      return formatText(
                        { id: 'errors.milestone.characters' },
                        { paymentIndex: index + 1 },
                      );
                    })
                    .required(({ path }) => {
                      const index = getLastIndexFromPath(path);
                      if (index === undefined) {
                        return formatText({ id: 'errors.amount' });
                      }
                      return formatText(
                        { id: 'errors.milestone.required' },
                        { paymentIndex: index + 1 },
                      );
                    }),
                  [AMOUNT_FIELD_NAME]: string()
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
                    .test('tokens-sum-exceeded', '', (value, context) =>
                      allTokensAmountValidation({
                        value,
                        context,
                        colony,
                        networkInverseFee,
                      }),
                    ),
                  [TOKEN_FIELD_NAME]: string().required(),
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
            const { stages } = item || {};

            if (!stages) {
              return false;
            }

            return stages.every((payment) => {
              return colonyTokens.some(
                (colonyToken) =>
                  colonyToken.tokenAddress === payment.tokenAddress,
              );
            });
          },
        )
        .defined()
        .concat(ACTION_BASE_VALIDATION_SCHEMA),
    [colony, colonyTokens, networkInverseFee],
  );
};

export type StagedPaymentFormValues = InferType<
  ReturnType<typeof useValidationSchema>
>;

export const useStagePayment = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const { nativeToken } = colony;
  const { networkInverseFee = '0' } = useNetworkInverseFee();
  const validationSchema = useValidationSchema(networkInverseFee);
  const { setExpectedExpenditureType } = usePaymentBuilderContext();

  useActionFormBaseHook({
    validationSchema,
    defaultValues: useMemo<DeepPartial<StagedPaymentFormValues>>(
      () => ({
        createdIn: Id.RootDomain,
        stages: [
          {
            tokenAddress: nativeToken.tokenAddress,
          },
        ],
      }),
      [nativeToken.tokenAddress],
    ),
    actionType: ActionTypes.EXPENDITURE_CREATE,
    getFormOptions: (formOptions, form) =>
      getFormOptions(
        {
          ...formOptions,
          onSuccess: () => setExpectedExpenditureType(ExpenditureType.Staged),
          actionType: ActionTypes.EXPENDITURE_CREATE,
        },
        form,
      ),
    transform: mapPayload((payload: StagedPaymentFormValues) => {
      return getStagedPaymentPayload(colony, payload, networkInverseFee);
    }),
  });
};
