import React, { FC, useState } from 'react';

import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useMounted from '~hooks/useMounted.ts';
import { getFormAction } from '~utils/actions.ts';

import Button from './Button.tsx';
import { ActionButtonProps } from './types.ts';

const ActionButton: FC<ActionButtonProps> = ({
  actionType,
  error,
  submit,
  success,
  onSuccess,
  onError,
  transform,
  values,
  ...props
}) => {
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
      if (typeof onSuccess == 'function') onSuccess(result);
    } catch (err) {
      setLoading(false);
      onError?.(err);
    }
  };

  return <Button onClick={handleClick} loading={loading} {...props} />;
};

export default ActionButton;
