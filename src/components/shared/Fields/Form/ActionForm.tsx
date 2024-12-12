import React, {
  type MouseEventHandler,
  type ButtonHTMLAttributes,
} from 'react';
import { type FieldValues, type UseFormReturn } from 'react-hook-form';

import { authenticateWalletWithRetry } from '~auth';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import { type ActionTypes, type ActionTypeString } from '~redux/index.ts';
import { type ActionTransformFnType, getFormAction } from '~utils/actions.ts';

import Form, {
  type CustomSubmitErrorHandler,
  type CustomSubmitHandler,
  type FormProps,
} from './Form.tsx';

const displayName = 'Form.ActionForm';

export type OnSuccess<V extends FieldValues> = (
  values: V,
  formHelpers: UseFormReturn<V, any>,
  result: any,
) => void;

export interface ActionFormProps<
  V extends Record<string, any> = Record<string, any>,
> extends Omit<FormProps<V>, 'onError' | 'onSubmit'> {
  /** Redux action type to dispatch on submit (e.g. CREATE_XXX) */
  actionType: ActionTypes;

  /** Redux action to dispatch on submit (e.g. CREATE_XXX) */
  submit?: ActionTypeString;

  /** Redux action listener for successful action (e.g. CREATE_XXX_SUCCESS) */
  success?: ActionTypeString;

  /** Redux action listener for unsuccessful action (e.g. CREATE_XXX_ERROR) */
  error?: ActionTypeString;

  /** Function to call after successful action was dispatched */
  onSuccess?: OnSuccess<V> | (() => void);

  /** Function to call after error action was dispatched */
  onError?: CustomSubmitErrorHandler<V>;

  /** Function to call in the event that the form submit errors */
  onSubmitError?: CustomSubmitErrorHandler<V>;

  /** A function to transform the action after the form data was passed in (as payload) */
  transform?: ActionTransformFnType;

  /** A form id you can directly associate a submit button with */
  id?: string;

  /** Primary button prop overrides */
  primaryButton?: {
    /** The form's primary button type */
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];

    /** Function called when the form's primary button type is set to "button" */
    onClick?: MouseEventHandler<HTMLButtonElement>;
  };
  testId?: string;

  /** On form close behaviour overrides */
  onFormClose?: {
    /** When satisfied, it causes the cancel modal to be shown */
    shouldShowCancelModal?: boolean;
  };
}

const ActionForm = <V extends Record<string, any>>({
  onSuccess,
  onError,
  onSubmitError,
  submit,
  success,
  error,
  actionType,
  transform,
  innerRef,
  ...props
}: ActionFormProps<V>) => {
  const asyncFunction = useAsyncFunction({
    submit: submit || actionType,
    error: error || getFormAction(actionType, 'ERROR'),
    success: success || getFormAction(actionType, 'SUCCESS'),
    transform,
  });
  const handleSubmit: CustomSubmitHandler<V> = async (values, formHelpers) => {
    try {
      // Force re-auth check to account for loss of auth/connection after the session has been started
      await authenticateWalletWithRetry();
      const res = await asyncFunction(values);
      onSuccess?.(values, formHelpers, res);
    } catch (e) {
      console.error('Error while submitting form', e);
      onError?.(e, formHelpers);
    }
  };

  return (
    <Form
      {...props}
      onSubmit={handleSubmit}
      onError={onSubmitError}
      innerRef={innerRef}
    />
  );
};

ActionForm.displayName = displayName;

export default ActionForm;
