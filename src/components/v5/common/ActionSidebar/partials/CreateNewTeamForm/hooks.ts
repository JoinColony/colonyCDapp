import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { ActionTypes } from '~redux';
import { mapPayload, pipe, withMeta } from '~utils/actions';
import { useColonyContext } from '~hooks';
import {
  MAX_ANNOTATION_LENGTH,
  MAX_COLONY_DISPLAY_NAME,
  MAX_DOMAIN_PURPOSE_LENGTH,
} from '~constants';
import { getCreateDomainDialogPayload } from '~common/Dialogs/CreateDomainDialog/helpers';
import { useActionHook } from '../ActionForm/hooks';
import { DomainColor } from '~gql';

export const useCrateNewTeam = () => {
  const { colony } = useColonyContext();
  const navigate = useNavigate();

  const transform = pipe(
    mapPayload((payload) => {
      const values = {
        domainName: payload.teamName,
        domainPurpose: payload.domainPurpose,
        domainColor: payload.domainColor,
        motionDomainId: payload.createdIn,
        decisionMethod: payload.decisionMethod,
        annotation: payload.annotation,
      };
      if (colony) {
        return getCreateDomainDialogPayload(colony, values);
      }
      return null;
    }),
    withMeta({ navigate }),
  );

  const validationSchema = yup
    .object()
    .shape({
      forceAction: yup.boolean().defined(),
      teamName: yup
        .string()
        .trim()
        .max(MAX_COLONY_DISPLAY_NAME)
        .required(() => 'Team name required'),
      domainPurpose: yup
        .string()
        .trim()
        .max(MAX_DOMAIN_PURPOSE_LENGTH)
        .notRequired(),
      domainColor: yup.string().notRequired(),
      createdIn: yup.number().defined(),
      decisionMethod: yup.string().defined(),
      annotation: yup.string().max(MAX_ANNOTATION_LENGTH).notRequired(),
    })
    .defined();

  return useActionHook({
    validationSchema,
    transform,
    defaultValues: {
      forceAction: false,
      teamName: '',
      domainPurpose: '',
      domainColor: DomainColor.LightPink,
      createdIn: 1,
      decisionMethod: 'reputation',
      annotation: '',
    },
    defaultAction: ActionTypes.MOTION_DOMAIN_CREATE_EDIT,
    actionType: ActionTypes.ACTION_DOMAIN_CREATE,
  });
};
