import { Id } from '@colony/colony-js';
import { useCallback, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { type DeepPartial } from 'utility-types';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { DecisionMethod } from '~gql';
import { ActionTypes } from '~redux/index.ts';
import { mapPayload, pipe } from '~utils/actions.ts';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import useActionFormBaseHook from '~v5/common/ActionSidebar/hooks/useActionFormBaseHook.ts';
import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';

import { validationSchema, type UpgradeColonyFormValues } from './consts.ts';
import { getUpgradeColonyPayload } from './utils.tsx';

export const useUpgradeColony = (
  getFormOptions: CreateActionFormProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });

  useActionFormBaseHook({
    actionType:
      decisionMethod === DecisionMethod.Permissions
        ? ActionTypes.ACTION_VERSION_UPGRADE
        : ActionTypes.ROOT_MOTION,
    getFormOptions,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((values: UpgradeColonyFormValues) => {
          return getUpgradeColonyPayload(colony, values);
        }),
      ),
      [colony],
    ),
    defaultValues: useMemo<DeepPartial<UpgradeColonyFormValues>>(
      () => ({
        createdIn: Id.RootDomain,
      }),
      [],
    ),
    validationSchema,
  });
};
