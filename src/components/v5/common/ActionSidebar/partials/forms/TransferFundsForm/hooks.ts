import { useCallback, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { DeepPartial } from 'utility-types';
import { useWatch } from 'react-hook-form';

import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { useColonyContext } from '~hooks';
import { getTransferFundsDialogPayload } from '~common/Dialogs/TransferFundsDialog/helpers';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts';

import { ActionFormBaseProps } from '../../../types';
import {
  DecisionMethod,
  DECISION_METHOD,
  useActionFormBaseHook,
} from '../../../hooks';
import { validationSchema, TransferFundsFormValues } from './consts';

export const useTransferFunds = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });

  useActionFormBaseHook({
    validationSchema,
    defaultValues: useMemo<DeepPartial<TransferFundsFormValues>>(
      () => ({
        createdIn: Id.RootDomain.toString(),
        to: Id.RootDomain.toString(),
        from: Id.RootDomain.toString(),
        amount: {
          tokenAddress: colony?.nativeToken.tokenAddress,
        },
      }),
      [colony?.nativeToken.tokenAddress],
    ),
    actionType:
      decisionMethod === DECISION_METHOD.Permissions
        ? ActionTypes.ACTION_MOVE_FUNDS
        : ActionTypes.MOTION_MOVE_FUNDS,
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
