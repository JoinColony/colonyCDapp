import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

import { ActionTypes } from '~redux';
import { mapPayload, pipe, withMeta } from '~utils/actions';
import { useColonyContext } from '~hooks';
import { MAX_ANNOTATION_LENGTH } from '~constants';
import { useActionHook } from '../ActionForm/hooks';

export const useCreateDecision = () => {
  const { colony } = useColonyContext();
  const navigate = useNavigate();

  const transform = pipe(
    mapPayload(() => {
      // const values = {
      //   decisionMethod: payload.decisionMethod,
      //   motionDomainId: payload.createdIn,
      //   annotation: payload.annotation,
      // };
      if (colony) {
        // @TODO: add correct method
      }
      return null;
    }),
    withMeta({ navigate }),
  );

  const validationSchema = yup
    .object()
    .shape({
      forceAction: yup.bool().defined(),
      decisionMethod: yup.string().defined(),
      createdIn: yup.string().defined(),
      annotation: yup.string().max(MAX_ANNOTATION_LENGTH).defined(),
    })
    .defined();

  return useActionHook({
    validationSchema,
    transform,
    defaultValues: {
      forceAction: false,
      decisionMethod: 'reputation',
      createdIn: '',
      annotation: '',
    },
    actionType: ActionTypes.DECISION_DRAFT_CREATED,
  });
};
