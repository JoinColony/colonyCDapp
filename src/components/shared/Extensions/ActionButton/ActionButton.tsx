import React, { FC, useState } from 'react';

import { useAsyncFunction, useMounted } from '~hooks';
import DefaultButton from '~shared/Extensions/Button';
import { ActionButtonProps } from './types';

const displayName = 'Extensions.ActionButton';

const ActionButton: FC<ActionButtonProps> = ({
  button,
  error,
  submit,
  success,
  onSuccess,
  onError,
  values,
  transform,
  ...props
}) => {
  const isMountedRef = useMounted();
  const [loading, setLoading] = useState(false);
  const asyncFunction = useAsyncFunction({ submit, error, success, transform });

  const handleClick = async () => {
    let result;
    setLoading(true);

    try {
      const asyncFuncValues = typeof values == 'function' ? await values() : values;
      result = await asyncFunction(asyncFuncValues);

      if (typeof onSuccess == 'function') {
        onSuccess(result);
      }
    } catch (err) {
      if (typeof onError == 'function') {
        onError(err);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const Button = button || DefaultButton;
  return <Button onClick={handleClick} loading={loading} {...props} />;
};

ActionButton.displayName = displayName;

export default ActionButton;
