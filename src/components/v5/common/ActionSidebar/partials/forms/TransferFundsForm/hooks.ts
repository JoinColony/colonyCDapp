import { Id } from '@colony/colony-js';
import { useCallback, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { DeepPartial } from 'utility-types';
import { InferType, number, object, string } from 'yup';

import { MAX_ANNOTATION_LENGTH } from '~constants';
import { useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { formatText } from '~utils/intl';
import { toFinite } from '~utils/lodash';
import { hasEnoughFundsValidation } from '~utils/validation/hasEnoughFundsValidation';
import {
  ACTION_BASE_VALIDATION_SCHEMA,
  DECISION_METHOD_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts';

import { DecisionMethod, useActionFormBaseHook } from '../../../hooks';
import { ActionFormBaseProps } from '../../../types';

import { getTransferFundsPayload } from './utils';

export const useValidationSchema = () => {
  const { colony } = useColonyContext();
  const { watch } = useFormContext();
  const selectedTeam = watch('from');

  const validationSchema = useMemo(
    () =>
      object()
        .shape({
          amount: object()
            .shape({
              amount: number()
                .required(() => formatText({ id: 'validation.required' }))
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
            .required(),
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
          description: string().max(MAX_ANNOTATION_LENGTH).notRequired(),
        })
        .defined()
        .concat(ACTION_BASE_VALIDATION_SCHEMA),
    [colony, selectedTeam],
  );

  return validationSchema;
};

export type TransferFundsFormValues = InferType<
  ReturnType<typeof useValidationSchema>
>;

export const useTransferFunds = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const {
    [DECISION_METHOD_FIELD_NAME]: decisionMethod,
    from,
    amount,
  } = useWatch<{
    decisionMethod: DecisionMethod;
    from: TransferFundsFormValues['from'];
    amount: TransferFundsFormValues['amount'];
  }>();

  const selectedTokenAddress = amount?.tokenAddress;
  const validationSchema = useValidationSchema();

  useActionFormBaseHook({
    validationSchema,
    defaultValues: useMemo<DeepPartial<TransferFundsFormValues>>(
      () => ({
        createdIn: from || Id.RootDomain,
        from: Id.RootDomain,
        amount: {
          tokenAddress:
            selectedTokenAddress ?? colony?.nativeToken.tokenAddress,
        },
      }),
      [from, selectedTokenAddress, colony?.nativeToken.tokenAddress],
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
          if (!colony) {
            return null;
          }

          return getTransferFundsPayload(colony, values);
        }),
      ),
      [colony],
    ),
  });
};
