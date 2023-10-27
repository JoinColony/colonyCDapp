import { useCallback, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { DeepPartial } from 'utility-types';
import { ActionTypes, RootMotionMethodNames } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { useColonyContext, useEnabledExtensions } from '~hooks';
import { ActionFormBaseProps } from '../../../types';
import { useActionFormBaseHook } from '../../../hooks';
import { DECISION_METHOD_OPTIONS } from '../../consts';
import { validationSchema, UpgradeColonyFormValues } from './consts';

export const useUpgradeColony = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const { isVotingReputationEnabled } = useEnabledExtensions();

  useActionFormBaseHook({
    actionType: isVotingReputationEnabled
      ? ActionTypes.ROOT_MOTION
      : ActionTypes.ACTION_VERSION_UPGRADE,
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
        decisionMethod: DECISION_METHOD_OPTIONS[0]?.value,
        annotation: '',
        createdIn: Id.RootDomain.toString(),
      }),
      [],
    ),
    validationSchema,
  });
};
