import React from 'react';

import { UseFormReturn, FieldValues } from 'react-hook-form';
import { ActionTypeString } from '~redux';
import { ActionTransformFnType } from '~utils/actions';
import { useAsyncFunction } from '~hooks';

import HookForm, {
  CustomSubmitErrorHandler,
  CustomSubmitHandler,
  HookFormProps,
} from './HookForm';

const displayName = 'Form.ActionHookForm';

export type OnSuccess<V extends FieldValues> = (
  result: any,
  values: V,
  FormValues: UseFormReturn<V>,
) => void;

interface Props<V extends Record<string, any>>
  extends Omit<HookFormProps<V>, 'onError' | 'onSubmit'> {
  /** Redux action type to dispatch on submit (e.g. CREATE_XXX) */
  actionType: ActionTypes;

  /** Redux action to dispatch on submit (e.g. CREATE_XXX) */
  submit?: ActionTypeString;

  /** Redux action listener for successful action (e.g. CREATE_XXX_SUCCESS) */
  success?: ActionTypeString;

  /** Redux action listener for unsuccessful action (e.g. CREATE_XXX_ERROR) */
  error?: ActionTypeString;

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
  onSuccess,
  onError,
  onSubmitError,
  submit,
  success,
  error,
  actionType,
  transform,
  ...props
}: Props<V>) => {
  const asyncFunction = useAsyncFunction({
    submit: submit || actionType,
    error: error || getFormAction(actionType, 'ERROR'),
    success: success || getFormAction(actionType, 'SUCCESS'),
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
