import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { ActionTypes } from '~redux';
import { mapPayload, pipe, withMeta } from '~utils/actions';
import { useAppContext, useColonyContext } from '~hooks';
import { MAX_ANNOTATION_LENGTH } from '~constants';
import { useActionHook } from '../ActionForm/hooks';
import { getRecoveryModeDialogPayload } from '~common/Dialogs/RecoveryModeDialog/helpers';

export const useEnterRecoveryMode = () => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const navigate = useNavigate();

  const validationSchema = yup
    .object()
    .shape({
      forceAction: yup.bool().defined(),
      createdIn: yup.number().defined(),
      decisionMethod: yup.string().defined(),
      annotation: yup.string().max(MAX_ANNOTATION_LENGTH).defined(),
    })
    .defined();

  const transform = pipe(
    mapPayload((payload) => {
      const values = {
        motionDomainId: payload.createdIn,
        decisionMethod: payload.decisionMethod,
        annotation: payload.annotation,
      };
      if (colony) {
        return getRecoveryModeDialogPayload(colony, values, user);
      }
      return null;
    }),
    withMeta({ navigate }),
  );

  return useActionHook({
    validationSchema,
    transform,
    defaultValues: {
      forceAction: false,
      decisionMethod: 'reputation',
      annotation: '',
      createdIn: 1,
    },
    actionType: ActionTypes.ACTION_UNLOCK_TOKEN,
  });
};
