import { useForm } from 'react-hook-form';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { ActionTypes } from '~redux';
import { getFormAction, mapPayload, pipe, withMeta } from '~utils/actions';
import {
  useAsyncFunction,
  useColonyContext,
  useEnabledExtensions,
} from '~hooks';
import { MAX_ANNOTATION_LENGTH } from '~constants';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { getCreateDomainDialogPayload } from '~common/Dialogs/CreateDomainDialog/helpers';
import { Colony } from '~types';

export const useCrateNewTeam = () => {
  const { toggleActionSidebarOff } = useActionSidebarContext();
  const { isVotingReputationEnabled } = useEnabledExtensions();
  const { colony } = useColonyContext();
  const navigate = useNavigate();

  const actionType = isVotingReputationEnabled
    ? ActionTypes.MOTION_DOMAIN_CREATE_EDIT
    : ActionTypes.ACTION_DOMAIN_CREATE;

  const transform = pipe(
    mapPayload((payload) =>
      getCreateDomainDialogPayload(colony as Colony, payload),
    ),
    withMeta({ navigate }),
  );

  const asyncFunction = useAsyncFunction({
    submit: actionType,
    error: getFormAction(actionType, 'ERROR'),
    success: getFormAction(actionType, 'SUCCESS'),
    transform,
  });

  const validationSchema = yup
    .object()
    .shape({
      forceAction: yup.boolean().defined(),
      teamName: yup
        .string()
        .trim()
        .max(20)
        .required(() => 'Team name required'),
      domainPurpose: yup.string().trim().max(90).notRequired(),
      domainColor: yup.string().notRequired(),
      createdIn: yup.string().defined(),
      decisionMethod: yup.string().defined(),
      annotation: yup.string().max(MAX_ANNOTATION_LENGTH).notRequired(),
    })
    .defined();

  type FormValues = yup.InferType<typeof validationSchema>;

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(validationSchema),
    defaultValues: {
      forceAction: false,
      teamName: '',
      domainPurpose: '',
      domainColor: '',
      createdIn: '',
      decisionMethod: '',
      annotation: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await asyncFunction({
        teamName: values.teamName,
        domainPurpose: values.domainPurpose,
        domainColor: values.domainColor,
        motionDomainId: values.createdIn,
        decisionMethod: values.decisionMethod,
        annotation: values.annotation,
      });
      toggleActionSidebarOff();
    } catch (e) {
      console.error(e);
    }
  };

  return {
    methods,
    onSubmit,
  };
};
