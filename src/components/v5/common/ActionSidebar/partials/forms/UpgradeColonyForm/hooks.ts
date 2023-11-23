import { useCallback, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { DeepPartial } from 'utility-types';
import { useWatch } from 'react-hook-form';

import { ActionTypes, RootMotionMethodNames } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { useColonyContext } from '~hooks';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts';

import { ActionFormBaseProps } from '../../../types';
import { DecisionMethod, useActionFormBaseHook } from '../../../hooks';
import { validationSchema, UpgradeColonyFormValues } from './consts';

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
        mapPayload((payload: UpgradeColonyFormValues) => {
          if (colony) {
            return {
              operationName: RootMotionMethodNames.Upgrade,
              colonyAddress: colony.colonyAddress,
              colonyName: colony.name,
              version: colony.version,
              motionParams: [colony.version + 1],
              annotationMessage: payload.annotation,
            };
          }

          return null;
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
