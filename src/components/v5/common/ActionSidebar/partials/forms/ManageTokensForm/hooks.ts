import { Id } from '@colony/colony-js';
import { useCallback, useMemo } from 'react';
import { useWatch } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ActionTypes } from '~redux/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { mapPayload, pipe } from '~utils/actions.ts';
import { notNull } from '~utils/arrays/index.ts';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';

import useActionFormBaseHook from '../../../hooks/useActionFormBaseHook.ts';
import { type ActionFormBaseProps } from '../../../types.ts';

import { validationSchema, type ManageTokensFormValues } from './consts.ts';
import { getManageTokensPayload } from './utils.tsx';

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
    () => colony.tokens?.items.filter(notNull) || [],
    [colony.tokens?.items],
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
        ? ActionTypes.ACTION_MANAGE_TOKENS
        : ActionTypes.MOTION_EDIT_COLONY,
    defaultValues: useMemo(
      () => ({
        createdIn: Id.RootDomain,
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
          return getManageTokensPayload(colony, values);
        }),
      ),
      [colony, user],
    ),
  });

  return { shouldShowMenu };
};
