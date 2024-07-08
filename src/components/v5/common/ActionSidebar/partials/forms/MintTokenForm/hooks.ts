import { Id } from '@colony/colony-js';
import { useCallback, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { type DeepPartial } from 'utility-types';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ActionTypes } from '~redux/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { mapPayload, pipe } from '~utils/actions.ts';
import { removeCacheEntry, CacheQueryKeys } from '~utils/queries.ts';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import useActionFormBaseHook from '~v5/common/ActionSidebar/hooks/useActionFormBaseHook.ts';
import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';

import { type MintTokenFormValues, validationSchema } from './consts.ts';
import { getMintTokenPayload } from './utils.tsx';

export const useMintToken = (
  getFormOptions: CreateActionFormProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });

  useActionFormBaseHook({
    validationSchema,
    defaultValues: useMemo<DeepPartial<MintTokenFormValues>>(
      () => ({
        createdIn: Id.RootDomain,
        tokenAddress: colony.nativeToken.tokenAddress,
      }),
      [colony],
    ),
    actionType:
      decisionMethod === DecisionMethod.Permissions
        ? ActionTypes.ACTION_MINT_TOKENS
        : ActionTypes.ROOT_MOTION,
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
    onSuccess: () => {
      /**
       * We need to remove all getDomainBalance queries once a payment has been successfully completed
       * By default it will refetch all active queries
       */
      if (decisionMethod === DecisionMethod.Permissions) {
        removeCacheEntry(CacheQueryKeys.GetDomainBalance);
      }
    },
  });
};
