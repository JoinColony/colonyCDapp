import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import { ActionHookOptionsProps } from './types';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { getFormAction } from '~utils/actions';
import { useAsyncFunction, useEnabledExtensions } from '~hooks';
import { ActionTypes } from '~redux';
import { useActionFormContext } from './ActionFormContext';

export const useActionHook = ({
  validationSchema,
  transform,
  defaultValues,
  defaultAction = ActionTypes.ROOT_MOTION,
  actionType,
}: ActionHookOptionsProps) => {
  const { toggleActionSidebarOff } = useActionSidebarContext();
  const { isVotingReputationEnabled } = useEnabledExtensions();
  const { changeFormErrorsState } = useActionFormContext();
  const [isForce, setIsForce] = useState(false);

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const { forceAction } = methods.watch();

  useEffect(() => {
    if (forceAction !== isForce) {
      setIsForce(forceAction);
    }
  }, [forceAction, isForce, setIsForce]);

  const action =
    isVotingReputationEnabled && !isForce ? defaultAction : actionType;

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

  useEffect(() => {
    changeFormErrorsState?.(methods?.formState?.errors);
  }, [changeFormErrorsState, methods?.formState?.errors]);

  return {
    methods,
    onSubmit,
  };
};
