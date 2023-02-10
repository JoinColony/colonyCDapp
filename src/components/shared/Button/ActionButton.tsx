import React, { useState, ElementType } from 'react';
import { MessageDescriptor } from 'react-intl';

import { ActionTransformFnType } from '~utils/actions';
import { useAsyncFunction, useMounted } from '~hooks';
import DefaultButton from '~shared/Button';
import { ActionTypes } from '~redux';
import { Props as DefaultButtonProps } from './Button';

const getFormAction = (
  action: ActionTypes,
  actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS',
) => {
  const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;
  return `${action}${actionEnd}`;
};

interface Props extends DefaultButtonProps {
  actionType: ActionTypes;
  button?: ElementType;
  confirmText?: any;
  onConfirmToggled?: (...args: any[]) => void;
  onSuccess?: (result: any) => void;
  text?: MessageDescriptor | string;
  transform?: ActionTransformFnType;
  values?: any | (() => any | Promise<any>);
}

const ActionButton = ({
  actionType,
  button,
  onSuccess,
  // @todo Remove `values` once async transform functions are supported
  values,
  transform,
  ...props
}: Props) => {
  const submit = getFormAction(actionType, 'SUBMIT');
  const error = getFormAction(actionType, 'ERROR');
  const success = getFormAction(actionType, 'SUCCESS');
  const isMountedRef = useMounted();
  const [loading, setLoading] = useState(false);
  const asyncFunction = useAsyncFunction({ submit, error, success, transform });

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

      /**
       * @todo : display error somewhere
       */
      return;
    }
    if (typeof onSuccess == 'function') onSuccess(result);
  };

  const Button = button || DefaultButton;
  return <Button onClick={handleClick} loading={loading} {...props} />;
};

export default ActionButton;
