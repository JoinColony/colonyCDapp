import { useCallback, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { Id } from '@colony/colony-js';
import { DeepPartial } from 'utility-types';

import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { useColonyContext, useNetworkInverseFee } from '~hooks';
import { getCreatePaymentDialogPayload } from '~common/Dialogs/CreatePaymentDialog/helpers';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts';

import { ActionFormBaseProps } from '../../../types';
import {
  DecisionMethod,
  DECISION_METHOD,
  useActionFormBaseHook,
} from '../../../hooks';
import { SimplePaymentFormValues, validationSchema } from './consts';

export const useSimplePayment = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { networkInverseFee } = useNetworkInverseFee();
  const { colony } = useColonyContext();
  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });
  const tokenAddress: string = useWatch({ name: 'amount.tokenAddress' });

  useActionFormBaseHook({
    validationSchema,
    defaultValues: useMemo<DeepPartial<SimplePaymentFormValues>>(
      () => ({
        createdIn: Id.RootDomain.toString(),
        payments: [],
        amount: {
          tokenAddress: colony?.nativeToken.tokenAddress,
        },
      }),
      [colony?.nativeToken.tokenAddress],
    ),
    actionType:
      decisionMethod === DECISION_METHOD.Permissions
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
    tokenAddress,
  };
};
