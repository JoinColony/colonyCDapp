import { Id } from '@colony/colony-js';
import { useCallback, useMemo } from 'react';
import { useWatch } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext';
import { useAppContext, useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { notNull } from '~utils/arrays';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts';

import { DecisionMethod, useActionFormBaseHook } from '../../../hooks';
import { ActionFormBaseProps } from '../../../types';

import { validationSchema, ManageTokensFormValues } from './consts';
import { getManageTokensPayload } from './utils';

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
        mapPayload((values: ManageTokensFormValues) => {
          if (!colony) {
            return null;
          }

          return getManageTokensPayload(colony, values);
        }),
      ),
      [colony, user],
    ),
  });

  return { shouldShowMenu };
};
