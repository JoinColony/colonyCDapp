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
import { getUnlockTokenDialogPayload } from '~common/Dialogs/UnlockTokenDialog/helpers';

export const useUpgradeColony = () => {
  const { toggleActionSidebarOff } = useActionSidebarContext();
  const { isVotingReputationEnabled } = useEnabledExtensions();
  const { colony } = useColonyContext();
  const navigate = useNavigate();

  const actionType = isVotingReputationEnabled
    ? ActionTypes.ROOT_MOTION
    : ActionTypes.ACTION_VERSION_UPGRADE;

  const transform = pipe(
    mapPayload((payload) => {
      if (colony) {
        return getUnlockTokenDialogPayload(colony, payload);
      }
      return null;
    }),
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
      forceAction: yup.bool().defined(),
      createdIn: yup.number().defined(),
      decisionMethod: yup.string().defined(),
      annotation: yup.string().max(MAX_ANNOTATION_LENGTH).defined(),
    })
    .defined();

  type FormValues = yup.InferType<typeof validationSchema>;

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(validationSchema),
    defaultValues: {
      forceAction: false,
      annotation: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await asyncFunction({
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
