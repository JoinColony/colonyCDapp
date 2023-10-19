import { useCallback, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { DeepPartial } from 'utility-types';
import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { useColonyContext, useEnabledExtensions } from '~hooks';
import { getUnlockTokenDialogPayload } from '~common/Dialogs/UnlockTokenDialog/helpers';
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
          const values = {
            motionDomainId: payload.createdIn,
            decisionMethod: payload.decisionMethod,
            annotationMessage: payload.annotation,
          };

          if (colony) {
            return getUnlockTokenDialogPayload(colony, values);
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
