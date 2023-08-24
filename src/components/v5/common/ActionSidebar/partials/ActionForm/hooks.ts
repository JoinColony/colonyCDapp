import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import { ActionHookOptionsProps } from './types';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { getFormAction } from '~utils/actions';
import { useAsyncFunction, useEnabledExtensions } from '~hooks';
import { ActionTypes } from '~redux';

export const useActionHook = ({
  validationSchema,
  transform,
  defaultValues,
  defaultAction = ActionTypes.ROOT_MOTION,
  actionType,
}: ActionHookOptionsProps) => {
  const { toggleActionSidebarOff } = useActionSidebarContext();
  const { isVotingReputationEnabled } = useEnabledExtensions();

  const action = isVotingReputationEnabled ? defaultAction : actionType;

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  type FormValues = yup.InferType<typeof validationSchema>;

  const asyncFunction = useAsyncFunction({
    submit: action,
    error: getFormAction(action, 'ERROR'),
    success: getFormAction(action, 'SUCCESS'),
    transform,
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await asyncFunction(values);
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
