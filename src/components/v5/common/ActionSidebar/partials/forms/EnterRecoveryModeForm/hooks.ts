import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { ActionTypes } from '~redux';
import { mapPayload, pipe, withMeta } from '~utils/actions';
import { useAppContext, useColonyContext } from '~hooks';
import { MAX_ANNOTATION_LENGTH } from '~constants';
import { getRecoveryModeDialogPayload } from '~common/Dialogs/RecoveryModeDialog/helpers';
import { ActionFormBaseProps } from '../../../types';
import { useActionFormBaseHook } from '../../../hooks';

const validationSchema = yup
  .object()
  .shape({
    createdIn: yup.number().defined(),
    decisionMethod: yup.string().defined(),
    description: yup.string().max(MAX_ANNOTATION_LENGTH).defined(),
  })
  .defined();

export const useEnterRecoveryMode = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const navigate = useNavigate();

  useActionFormBaseHook({
    getFormOptions,
    validationSchema,
    actionType: ActionTypes.ACTION_UNLOCK_TOKEN,
    defaultValues: useMemo(
      () => ({
        description: '',
      }),
      [],
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((payload) => {
          const values = {
            annotation: payload.description,
          };
          if (colony) {
            return getRecoveryModeDialogPayload(colony, values, user);
          }
          return null;
        }),
        withMeta({ navigate }),
      ),
      [colony, user, navigate],
    ),
  });
};
