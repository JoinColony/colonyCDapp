import React, { useState, ElementType } from 'react';
import { MessageDescriptor } from 'react-intl';

import { ActionTransformFnType, getFormAction } from '~utils/actions';
import { useAsyncFunction, useMounted } from '~hooks';
import DefaultButton from '~shared/Button';
import { ActionTypes } from '~redux';

import { Props as DefaultButtonProps } from './Button';

export interface ActionButtonProps<P = any> extends DefaultButtonProps {
  /** The base (i.e. submit) redux action type */
  actionType: ActionTypes;
  button?: ElementType;
  buttonProps?: P;
  isLoading?: boolean;
  confirmText?: any;
  error?: string;
  onConfirmToggled?: (...args: any[]) => void;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  submit?: string;
  success?: string;
  text?: MessageDescriptor | string;
  transform?: ActionTransformFnType;
  values?: any | (() => any | Promise<any>);
}

const ActionButton = <P,>({
  actionType,
  button,
  buttonProps,
  isLoading,
  error,
  submit,
  success,
  onSuccess,
  onError,
  // @todo Remove `values` once async transform functions are supported
  values,
  transform,
  ...props
}: ActionButtonProps<P>) => {
  const submitAction = submit || actionType;
  const errorAction = error || getFormAction(actionType, 'ERROR');
  const successAction = success || getFormAction(actionType, 'SUCCESS');
  const isMountedRef = useMounted();
  const [loading, setLoading] = useState(false);
  const asyncFunction = useAsyncFunction({
    submit: submitAction,
    error: errorAction,
    success: successAction,
    transform,
  });

  const handleClick = async () => {
    let result;
    setLoading(true);
    try {
      const asyncFuncValues =
        typeof values == 'function' ? await values() : values;
      result = await asyncFunction(asyncFuncValues);
      if (isMountedRef.current) setLoading(false);
    } catch (err) {
      setLoading(false);
      onError?.(err);
      /**
       * @todo : display error somewhere
       */
      return;
    } finally {
      if (typeof onSuccess == 'function') onSuccess(result);
    }
  };

  const Button = button || DefaultButton;
  return (
    <Button
      onClick={handleClick}
      loading={loading || isLoading}
      {...buttonProps}
      {...props}
    />
  );
};

export default ActionButton;
