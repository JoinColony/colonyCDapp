import { Id } from '@colony/colony-js';
import { useCallback, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { DeepPartial } from 'utility-types';

import { useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts';

import { DecisionMethod, useActionFormBaseHook } from '../../../hooks';
import { ActionFormBaseProps } from '../../../types';

import { validationSchema, UpgradeColonyFormValues } from './consts';
import { getUpgradeColonyPayload } from './utils';

export const useUpgradeColony = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
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
          if (!colony) {
            return null;
          }

          return getUpgradeColonyPayload(colony, values);
        }),
      ),
      [colony],
    ),
    defaultValues: useMemo<DeepPartial<UpgradeColonyFormValues>>(
      () => ({
        createdIn: Id.RootDomain.toString(),
      }),
      [],
    ),
    validationSchema,
  });
};
