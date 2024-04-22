import { Id } from '@colony/colony-js';
import { useCallback, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { type DeepPartial } from 'utility-types';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ActionTypes } from '~redux/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { mapPayload, pipe } from '~utils/actions.ts';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';

import useActionFormBaseHook from '../../../hooks/useActionFormBaseHook.ts';
import { type ActionFormBaseProps } from '../../../types.ts';

import { type MintTokenFormValues, validationSchema } from './consts.ts';
import { getMintTokenPayload } from './utils.tsx';

export const useMintToken = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });

  const getActionToDispatch = () => {
    switch (decisionMethod) {
      case DecisionMethod.Permissions:
        return ActionTypes.ACTION_MINT_TOKENS;
      case DecisionMethod.Reputation:
        return ActionTypes.ROOT_MOTION;
      case DecisionMethod.MultiSig:
        return ActionTypes.ROOT_MULTISIG;
      default:
        // @TODO not returning anything here produces a TS error
        return ActionTypes.ACTION_MINT_TOKENS;
    }
  };

  useActionFormBaseHook({
    validationSchema,
    defaultValues: useMemo<DeepPartial<MintTokenFormValues>>(
      () => ({
        createdIn: Id.RootDomain,
        tokenAddress: colony.nativeToken.tokenAddress,
      }),
      [colony],
    ),
    actionType: getActionToDispatch(),
    getFormOptions,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((values: MintTokenFormValues) => {
          return getMintTokenPayload(colony, values);
        }),
      ),
      [colony],
    ),
  });
};
