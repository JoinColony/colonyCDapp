import { useCallback, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { DeepPartial } from 'utility-types';
import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { useColonyContext, useEnabledExtensions } from '~hooks';
import { getMintTokenDialogPayload } from '~common/Dialogs/MintTokenDialog/helpers';
import { ActionFormBaseProps } from '../../../types';
import { useActionFormBaseHook } from '../../../hooks';
import { DECISION_METHOD_OPTIONS } from '../../consts';
import { MintTokenFormValues, validationSchema } from './consts';

export const useMintToken = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const { isVotingReputationEnabled } = useEnabledExtensions();

  useActionFormBaseHook({
    validationSchema,
    defaultValues: useMemo<DeepPartial<MintTokenFormValues>>(
      () => ({
        createdIn: Id.RootDomain.toString(),
        description: '',
        decisionMethod: DECISION_METHOD_OPTIONS[0]?.value,
        amount: {
          // amount: 0, // Disable default value
          tokenAddress: colony?.nativeToken.tokenAddress || '',
        },
      }),
      [colony?.nativeToken.tokenAddress],
    ),
    actionType: isVotingReputationEnabled
      ? ActionTypes.ROOT_MOTION
      : ActionTypes.ACTION_MINT_TOKENS,
    getFormOptions,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((payload: MintTokenFormValues) => {
          const values = {
            mintAmount: payload.amount.amount,
            motionDomainId: payload.createdIn,
            decisionMethod: payload.decisionMethod,
            annotation: payload.description,
          };

          if (colony) {
            return getMintTokenDialogPayload(colony, values);
          }

          return null;
        }),
      ),
      [colony],
    ),
  });
};
