import React from 'react';

import { ActionTypes } from '~redux';
import { ActionTransformFnType } from '~utils/actions';
import { useAsyncFunction } from '~hooks';
import { getFormAction } from '~shared/Button/ActionButton';

import HookForm, {
  CustomSubmitErrorHandler,
  CustomSubmitHandler,
  HookFormProps,
} from './HookForm';
import { UseFormReturn } from 'react-hook-form';

const displayName = 'Form.ActionHookForm';

export type OnSuccess<V> = (
  result: any,
  values: V,
  formHelpers: UseFormReturn,
) => void;

interface Props<V extends Record<string, any>>
  extends Omit<HookFormProps<V>, 'onError' | 'onSubmit'> {
  /** Redux action to dispatch on submit (e.g. CREATE_XXX) */
  actionType: ActionTypes;

  /** Optional Redux action override */
  submit?: ActionTypes;

  /** Optional Redux action override */
  success?: ActionTypes;

  /** Optional Redux action override */
  error?: ActionTypes;

  /** Function to call after successful action was dispatched */
  onSuccess?: OnSuccess<V>;

  /** Function to call after error action was dispatched */
  onError?: CustomSubmitErrorHandler<V>;

  /** Function to call in the event that the form submit errors */
  onSubmitError?: CustomSubmitErrorHandler<V>;

  /** A function to transform the action after the form data was passed in (as payload) */
  transform?: ActionTransformFnType;
}

const ActionHookForm = <V extends Record<string, any>>({
  actionType,
  onSuccess,
  onError,
  onSubmitError,
  transform,
  submit,
  error,
  success,
  ...props
}: Props<V>) => {
  const submitAction = submit || actionType;
  const errorAction = error || getFormAction(actionType, 'ERROR');
  const successAction = success || getFormAction(actionType, 'SUCCESS');
  const asyncFunction = useAsyncFunction({
    submit: submitAction,
    error: errorAction,
    success: successAction,
    transform,
  });
  const handleSubmit: CustomSubmitHandler<V> = async (values, formHelpers) => {
    try {
      const res = await asyncFunction(values);
      onSuccess?.(res, values, formHelpers);
    } catch (e) {
      console.error(e);
      onError?.(e, formHelpers);
    }
  };

  return (
    <HookForm {...props} onSubmit={handleSubmit} onError={onSubmitError} />
  );
};

ActionHookForm.displayName = displayName;

export default ActionHookForm;
