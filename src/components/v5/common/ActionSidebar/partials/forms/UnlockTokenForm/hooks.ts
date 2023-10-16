import { useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { DeepPartial } from 'utility-types';
import { ActionTypes } from '~redux';
import { mapPayload, pipe, withMeta } from '~utils/actions';
import { useColonyContext } from '~hooks';
import { getUnlockTokenDialogPayload } from '~common/Dialogs/UnlockTokenDialog/helpers';
import { ActionFormBaseProps } from '../../../types';
import { useActionFormBaseHook } from '../../../hooks';
import { DECISION_METHOD_OPTIONS } from '../../consts';
import { UnlockTokenFormValues, validationSchema } from './consts';

export const useUnlockToken = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const navigate = useNavigate();

  useActionFormBaseHook({
    getFormOptions,
    actionType: ActionTypes.ACTION_UNLOCK_TOKEN,
    defaultValues: useMemo<DeepPartial<UnlockTokenFormValues>>(
      () => ({
        decisionMethod: DECISION_METHOD_OPTIONS[0]?.value,
        annotation: '',
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
        withMeta({ navigate }),
      ),
      [colony, navigate],
    ),
    validationSchema,
  });
};
