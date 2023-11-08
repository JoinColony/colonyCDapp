import { useCallback, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { DeepPartial } from 'utility-types';
import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import {
  useColonyContext,
  useEnabledExtensions,
  useNetworkInverseFee,
} from '~hooks';
import { getCreatePaymentDialogPayload } from '~common/Dialogs/CreatePaymentDialog/helpers';
import { ActionFormBaseProps } from '../../../types';
import { useActionFormBaseHook } from '../../../hooks';
import { DECISION_METHOD_OPTIONS } from '../../consts';
import { AdvancedPaymentFormValues, validationSchema } from './consts';

export const useAdvancedPayment = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { networkInverseFee } = useNetworkInverseFee();
  const { colony } = useColonyContext();
  const { isVotingReputationEnabled } = useEnabledExtensions();

  useActionFormBaseHook({
    validationSchema,
    defaultValues: useMemo<DeepPartial<AdvancedPaymentFormValues>>(
      () => ({
        createdIn: Id.RootDomain.toString(),
        decisionMethod: DECISION_METHOD_OPTIONS[0]?.value,
        description: '',
        payments: [
          {
            delay: 0,
            amount: {
              amount: 0,
              tokenAddress: colony?.nativeToken?.tokenAddress,
            },
          },
        ],
      }),
      [colony?.nativeToken?.tokenAddress],
    ),
    actionType: isVotingReputationEnabled
      ? ActionTypes.MOTION_EXPENDITURE_PAYMENT
      : ActionTypes.ACTION_EXPENDITURE_PAYMENT,
    getFormOptions,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((payload: AdvancedPaymentFormValues) => {
          if (!colony) {
            return null;
          }

          return getCreatePaymentDialogPayload(
            colony,
            {
              fromDomainId: payload.from,
              payments: [],
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
};
