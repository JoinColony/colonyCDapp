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
      if (isMountedRef.current) setLoading(false);
    } catch (err) {
      setLoading(false);

      return;
    }
    if (typeof onSuccess == 'function') onSuccess(result);
  };

  const Button = button || DefaultButton;
  return <Button onClick={handleClick} loading={loading} {...props} />;
};

ActionButton.displayName = displayName;

export default ActionButton;
