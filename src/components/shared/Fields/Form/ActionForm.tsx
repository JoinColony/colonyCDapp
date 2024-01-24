import React from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

import useAsyncFunction from '~hooks/useAsyncFunction';
import { ActionTypes, ActionTypeString } from '~redux';
import { ActionTransformFnType, getFormAction } from '~utils/actions';

import Form, {
  CustomSubmitErrorHandler,
  CustomSubmitHandler,
  FormProps,
} from './Form';

const displayName = 'Form.ActionForm';

export type OnSuccess<V extends FieldValues> = (
  values: V,
  formHelpers: UseFormReturn<V, any>,
  result: any,
) => void;

export interface ActionFormProps<V extends Record<string, any>>
  extends Omit<FormProps<V>, 'onError' | 'onSubmit'> {
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

const ActionForm = <V extends Record<string, any>>(
  {
    onSuccess,
    onError,
    onSubmitError,
    submit,
    success,
    error,
    actionType,
    transform,
    ...props
  }: ActionFormProps<V>,
  ref: React.ForwardedRef<UseFormReturn<V, any, undefined>>,
) => {
  const asyncFunction = useAsyncFunction({
    submit: submit || actionType,
    error: error || getFormAction(actionType, 'ERROR'),
    success: success || getFormAction(actionType, 'SUCCESS'),
    transform,
  });
  const handleSubmit: CustomSubmitHandler<V> = async (values, formHelpers) => {
    try {
      const res = await asyncFunction(values);
      onSuccess?.(values, formHelpers, res);
    } catch (e) {
      console.error(e);
      onError?.(e, formHelpers);
    }
  };

  return (
    <Form
      {...props}
      onSubmit={handleSubmit}
      onError={onSubmitError}
      ref={ref}
    />
  );
};

ActionForm.displayName = displayName;

export default React.forwardRef(ActionForm);
