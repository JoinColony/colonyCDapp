import { useCallback, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { useWatch } from 'react-hook-form';
import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { useColonyContext, useNetworkInverseFee } from '~hooks';
import { getCreatePaymentDialogPayload } from '~common/Dialogs/CreatePaymentDialog/helpers';
import { ActionFormBaseProps } from '../../../types';
import { useActionFormBaseHook } from '../../../hooks';
import { DECISION_METHOD_OPTIONS } from '../../consts';
import { notNull } from '~utils/arrays';
import { SplitPaymentFormValues, validationSchema } from './consts';

export const useSplitPayment = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { networkInverseFee } = useNetworkInverseFee();
  const { colony } = useColonyContext();
  const colonyTokens = useMemo(
    () =>
      colony?.tokens?.items
        .filter(notNull)
        .map((colonyToken) => colonyToken.token) || [],
    [colony?.tokens?.items],
  );
  const amount = useWatch({ name: 'amount' });
  const currentToken = useMemo(
    () =>
      colonyTokens.find(
        (token) => token?.tokenAddress === amount?.tokenAddress,
      ),
    [amount?.tokenAddress, colonyTokens],
  );
  const distributionMethod = useWatch({ name: 'distributionMethod' });

  useActionFormBaseHook({
    validationSchema,
    defaultValues: useMemo(
      () => ({
        amount: {
          amount: 0,
          tokenAddress: colony?.nativeToken.tokenAddress || '',
        },
        createdIn: Id.RootDomain.toString(),
        decisionMethod: DECISION_METHOD_OPTIONS[0]?.value,
        payments: [
          {
            percent: 0,
          },
        ],
      }),
      [colony?.nativeToken.tokenAddress],
    ),
    actionType: ActionTypes.ACTION_EXPENDITURE_PAYMENT,
    getFormOptions,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((payload: SplitPaymentFormValues) => {
          const values = {
            amount: payload.amount.amount,
            tokenAddress: payload.amount.tokenAddress,
            motionDomainId: payload.createdIn,
            annotation: payload.description,
            decisionMethod: payload.decisionMethod,
            payments: [],
          };

          if (colony) {
            return getCreatePaymentDialogPayload(
              colony,
              values,
              networkInverseFee,
            );
          }

          return null;
        }),
      ),
      [colony, networkInverseFee],
    ),
  });

  return {
    currentToken,
    amount: Number(amount?.amount || 0),
    distributionMethod,
  };
};
