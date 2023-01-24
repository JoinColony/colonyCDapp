import React from 'react';

import { ActionTypeString } from '~redux';
import { ActionTransformFnType } from '~utils/actions';
import { useAsyncFunction } from '~hooks';

import HookForm, {
  CustomSubmitErrorHandler,
  CustomSubmitHandler,
  HookFormProps,
} from './HookForm';

const displayName = 'Form.ActionHookForm';

export type OnSuccess<V> = (result: any, values: V) => void;

interface Props<V extends Record<string, any>>
  extends Omit<HookFormProps<V>, 'onError' | 'onSubmit'> {
  /** Redux action to dispatch on submit (e.g. CREATE_XXX) */
  submit: ActionTypeString;

  /** Redux action listener for successful action (e.g. CREATE_XXX_SUCCESS) */
  success: ActionTypeString;

  /** Redux action listener for unsuccessful action (e.g. CREATE_XXX_ERROR) */
  error: ActionTypeString;

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
  error,
  onSuccess,
  onError,
  onSubmitError,
  submit,
  success,
  transform,
  ...props
}: Props<V>) => {
  const asyncFunction = useAsyncFunction({
    submit,
    error,
    success,
    transform,
  });
  const handleSubmit: CustomSubmitHandler<V> = async (values, formHelpers) => {
    try {
      const res = await asyncFunction(values);
      onSuccess?.(res, values);
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
