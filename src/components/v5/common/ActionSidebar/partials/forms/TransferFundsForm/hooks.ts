import { useCallback, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { DeepPartial } from 'utility-types';
import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { useColonyContext, useEnabledExtensions } from '~hooks';
import { getTransferFundsDialogPayload } from '~common/Dialogs/TransferFundsDialog/helpers';
import { ActionFormBaseProps } from '../../../types';
import { useActionFormBaseHook } from '../../../hooks';
import { DECISION_METHOD_OPTIONS } from '../../consts';
import { validationSchema, TransferFundsFormValues } from './consts';

export const useTransferFunds = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const { isVotingReputationEnabled } = useEnabledExtensions();

  useActionFormBaseHook({
    validationSchema,
    defaultValues: useMemo<DeepPartial<TransferFundsFormValues>>(
      () => ({
        createdIn: Id.RootDomain.toString(),
        to: Id.RootDomain.toString(),
        from: Id.RootDomain.toString(),
        decisionMethod: DECISION_METHOD_OPTIONS[0]?.value,
        description: '',
        amount: {
          amount: 0,
          tokenAddress: colony?.nativeToken.tokenAddress || '',
        },
      }),
      [colony?.nativeToken.tokenAddress],
    ),
    actionType: isVotingReputationEnabled
      ? ActionTypes.MOTION_MOVE_FUNDS
      : ActionTypes.ACTION_MOVE_FUNDS,
    getFormOptions,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((payload: TransferFundsFormValues) => {
          const values = {
            amount: payload.amount.amount,
            motionDomainId: payload.createdIn,
            fromDomainId: payload.from,
            toDomainId: payload.to,
            tokenAddress: payload.amount.tokenAddress,
            decisionMethod: payload.decisionMethod,
            annotation: payload.description,
          };

          if (colony) {
            return getTransferFundsDialogPayload(colony, values);
          }

          return null;
        }),
      ),
      [colony],
    ),
  });
};
