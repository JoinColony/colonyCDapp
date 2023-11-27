import { useCallback, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { DeepPartial } from 'utility-types';
import { useWatch } from 'react-hook-form';

import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { useColonyContext } from '~hooks';
import { getUnlockTokenDialogPayload } from '~common/Dialogs/UnlockTokenDialog/helpers';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts';

import { ActionFormBaseProps } from '../../../types';
import {
  DecisionMethod,
  DECISION_METHOD,
  useActionFormBaseHook,
} from '../../../hooks';
import { UnlockTokenFormValues, validationSchema } from './consts';

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
      decisionMethod === DECISION_METHOD.Permissions
        ? ActionTypes.ACTION_UNLOCK_TOKEN
        : ActionTypes.ROOT_MOTION,
    defaultValues: useMemo<DeepPartial<UnlockTokenFormValues>>(
      () => ({
        createdIn: Id.RootDomain.toString(),
      }),
      [],
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((payload: UnlockTokenFormValues) => {
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
    validationSchema,
  });
};
