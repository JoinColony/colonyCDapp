import { useCallback, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { DeepPartial } from 'utility-types';
import { useFormContext, useWatch } from 'react-hook-form';
import { InferType, number, object, string } from 'yup';

import { ActionTypes } from '~redux';
import { MAX_ANNOTATION_LENGTH } from '~constants';
import { mapPayload, pipe } from '~utils/actions';
import { toFinite } from '~utils/lodash';
import { useColonyContext } from '~hooks';
import { hasEnoughFundsValidation } from '~utils/validation/hasEnoughFundsValidation';
import { formatText } from '~utils/intl';
import {
  ACTION_BASE_VALIDATION_SCHEMA,
  DECISION_METHOD_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts';

import { ActionFormBaseProps } from '../../../types';
import { DecisionMethod, useActionFormBaseHook } from '../../../hooks';
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
          createdIn: string().defined(),
          from: string().required(),
          to: string()
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

  const selectedDomainId = Number(from);

  useActionFormBaseHook({
    validationSchema,
    defaultValues: useMemo<DeepPartial<TransferFundsFormValues>>(
      () => ({
        createdIn: selectedDomainId.toString() || Id.RootDomain.toString(),
        from: Id.RootDomain.toString(),
        amount: {
          tokenAddress:
            selectedTokenAddress ?? colony?.nativeToken.tokenAddress,
        },
      }),
      [
        selectedDomainId,
        selectedTokenAddress,
        colony?.nativeToken.tokenAddress,
      ],
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
