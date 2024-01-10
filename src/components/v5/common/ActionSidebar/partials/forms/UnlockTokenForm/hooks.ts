import { Id } from '@colony/colony-js';
import { useCallback, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { DeepPartial } from 'utility-types';

import { useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import { mapPayload, pipe, withKey } from '~utils/actions';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts';

import { DecisionMethod, useActionFormBaseHook } from '../../../hooks';
import { ActionFormBaseProps } from '../../../types';

import { UnlockTokenFormValues, validationSchema } from './consts';
import { getUnlockTokenPayload } from './utils';

export const useUnlockToken = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
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
