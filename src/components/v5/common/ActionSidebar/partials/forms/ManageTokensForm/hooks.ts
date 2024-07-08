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
import useActionFormBaseHook from '~v5/common/ActionSidebar/hooks/useActionFormBaseHook.ts';
import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';
import { TokenStatus } from '~v5/common/types.ts';

import { validationSchema, type ManageTokensFormValues } from './consts.ts';
import { getManageTokensPayload } from './utils.ts';

export const useManageTokens = (
  getFormOptions: CreateActionFormProps['getFormOptions'],
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

  const blockchainNativeTokenAddress = colonyTokens.find(
    ({ colonyTokensId }) => colonyTokensId === 'DEFAULT_TOKEN_ID',
  )?.token.tokenAddress;

  const colonyNativeTokenAddress = colony?.nativeToken.tokenAddress;

  const shouldShowMenu = (status: TokenStatus) => {
    if (readonly) {
      return false;
    }

    return status !== TokenStatus.NotEditable;
  };

  const nativeTokens = useMemo(
    () => [
      ...(blockchainNativeTokenAddress ? [blockchainNativeTokenAddress] : []),
      colonyNativeTokenAddress,
    ],
    [blockchainNativeTokenAddress, colonyNativeTokenAddress],
  );

  const defaultColonyTokens = useMemo(
    () =>
      colonyTokens
        .map(({ token: { tokenAddress } }) => ({
          token: tokenAddress,
          status: nativeTokens.includes(tokenAddress)
            ? TokenStatus.NotEditable
            : TokenStatus.Unaffected,
        }))
        .sort((a) => (nativeTokens.includes(a.token) ? -1 : 0)),
    [colonyTokens, nativeTokens],
  );

  useActionFormBaseHook({
    getFormOptions,
    validationSchema,
    actionType:
      decisionMethod === DecisionMethod.Permissions
        ? ActionTypes.ACTION_MANAGE_TOKENS
        : ActionTypes.MOTION_MANAGE_TOKENS,
    defaultValues: useMemo(
      () => ({
        createdIn: Id.RootDomain,
        selectedTokenAddresses: defaultColonyTokens,
      }),
      [defaultColonyTokens],
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((values: ManageTokensFormValues) => {
          const updatedValues = {
            ...values,
            selectedTokenAddresses: values.selectedTokenAddresses.filter(
              ({ status }) => status !== TokenStatus.Removed,
            ),
          };

          return getManageTokensPayload(colony, updatedValues);
        }),
      ),
      [colony, user],
    ),
  });

  return { shouldShowMenu };
};
