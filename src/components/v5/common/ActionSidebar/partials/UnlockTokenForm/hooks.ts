import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { ActionTypes } from '~redux';
import { mapPayload, pipe, withMeta } from '~utils/actions';
import { useColonyContext } from '~hooks';
import { MAX_ANNOTATION_LENGTH } from '~constants';
import { getUnlockTokenDialogPayload } from '~common/Dialogs/UnlockTokenDialog/helpers';
import { useActionHook } from '../ActionForm/hooks';

export const useUnlockToken = () => {
  const { colony } = useColonyContext();
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
        annotationMessage: payload.annotation,
      };
      if (colony) {
        return getUnlockTokenDialogPayload(colony, values);
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
