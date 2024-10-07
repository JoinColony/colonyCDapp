import { Id } from '@colony/colony-js';
import { useCallback, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { type DeepPartial } from 'utility-types';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { DecisionMethod } from '~gql';
import { ActionTypes } from '~redux/index.ts';
import { mapPayload, pipe, withKey } from '~utils/actions.ts';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import useActionFormBaseHook from '~v5/common/ActionSidebar/hooks/useActionFormBaseHook.ts';
import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';

import { type UnlockTokenFormValues, validationSchema } from './consts.ts';
import { getUnlockTokenPayload } from './utils.tsx';

export const useUnlockToken = (
  getFormOptions: CreateActionFormProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });

  useActionFormBaseHook({
    getFormOptions,
    actionType:
      decisionMethod === DecisionMethod.Permissions
        ? ActionTypes.ACTION_UNLOCK_TOKEN
        : ActionTypes.ROOT_MOTION,
    defaultValues: useMemo<DeepPartial<UnlockTokenFormValues>>(
      () => ({
        createdIn: Id.RootDomain,
      }),
      [],
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        withKey(colony.colonyAddress),
        mapPayload((values: UnlockTokenFormValues) => {
          return getUnlockTokenPayload(colony, values);
        }),
      ),
      [colony],
    ),
    validationSchema,
  });
};
