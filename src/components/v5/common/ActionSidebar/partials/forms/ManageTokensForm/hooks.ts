import { useCallback, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { useAppContext, useColonyContext, useEnabledExtensions } from '~hooks';
import { ActionFormBaseProps } from '../../../types';
import { useActionFormBaseHook } from '../../../hooks';
import { getTokenManagementDialogPayload } from '~common/Dialogs/TokenManagementDialog/helpers';
import { notNull } from '~utils/arrays';
import { validationSchema, ManageTokensFormValues } from './consts';
import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext';

export const useManageTokens = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { readonly } = useAdditionalFormOptionsContext();
  const { isVotingReputationEnabled } = useEnabledExtensions();

  const colonyTokens = useMemo(
    () => colony?.tokens?.items.filter(notNull) || [],
    [colony?.tokens?.items],
  );

  const shouldShowMenu = useCallback(
    (token: string) => {
      if (readonly) {
        return false;
      }

      return !colonyTokens
        .map(({ token: colonyToken }) => colonyToken.tokenAddress)
        .some((colonyTokenAddress) => colonyTokenAddress === token);
    },
    [colonyTokens, readonly],
  );

  useActionFormBaseHook({
    getFormOptions,
    validationSchema,
    actionType: isVotingReputationEnabled
      ? ActionTypes.MOTION_EDIT_COLONY
      : ActionTypes.ACTION_EDIT_COLONY,
    defaultValues: useMemo(
      () => ({
        decisionMethod: '',
        annotation: '',
        createdIn: Id.RootDomain.toString(),
        selectedTokenAddresses: colonyTokens.map((token) => ({
          token: token?.token.tokenAddress,
        })),
      }),
      [colonyTokens],
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((payload: ManageTokensFormValues) => {
          const values = {
            motionDomainId: payload.createdIn,
            decisionMethod: payload.decisionMethod,
            annotation: payload.annotation,
            selectedTokenAddresses: payload.selectedTokenAddresses.map(
              ({ token }) => token,
            ),
            forceAction: false,
          };

          if (colony) {
            return getTokenManagementDialogPayload(colony, values);
          }

          return null;
        }),
      ),
      [colony, user],
    ),
  });

  return { shouldShowMenu };
};
