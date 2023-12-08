import { useCallback, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { useWatch } from 'react-hook-form';

import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { useAppContext, useColonyContext } from '~hooks';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts';
import { getTokenManagementDialogPayload } from '~common/Dialogs/TokenManagementDialog/helpers';
import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext';
import { notNull } from '~utils/arrays';

import { ActionFormBaseProps } from '../../../types';
import { DecisionMethod, useActionFormBaseHook } from '../../../hooks';
import { validationSchema, ManageTokensFormValues } from './consts';

export const useManageTokens = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { readonly } = useAdditionalFormOptionsContext();
  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });

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
    actionType:
      decisionMethod === DecisionMethod.Permissions
        ? ActionTypes.ACTION_EDIT_COLONY
        : ActionTypes.MOTION_EDIT_COLONY,
    defaultValues: useMemo(
      () => ({
        createdIn: Id.RootDomain.toString(),
        selectedTokenAddresses: colonyTokens.map(({ token }) => ({
          token: token.tokenAddress,
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
            annotation: payload.description,
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
