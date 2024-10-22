import { SpinnerGap } from '@phosphor-icons/react';
import React, { type FC, useState } from 'react';

import { useMobile } from '~hooks';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useMounted from '~hooks/useMounted.ts';
import { getFormAction } from '~utils/actions.ts';

import Button from './Button.tsx';
import IconButton from './IconButton.tsx';
import { LoadingBehavior, type ActionButtonProps } from './types.ts';

const ActionButton: FC<ActionButtonProps> = ({
  actionType,
  error,
  submit,
  success,
  onSuccess,
  onError,
  transform,
  values,
  isLoading = false,
  loadingBehavior,
  ...props
}) => {
  const isMobile = useMobile();
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
  const shouldShowLoading = loading || isLoading;

  const handleClick = async () => {
    if (props.disabled) return;
    let result;
    setLoading(true);
    try {
      const asyncFuncValues =
        typeof values == 'function' ? await values() : values;
      result = await asyncFunction(asyncFuncValues);
      if (isMountedRef.current) setLoading(false);
      if (typeof onSuccess == 'function') onSuccess(result);
    } catch (err) {
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingBehavior === LoadingBehavior.TxLoader && shouldShowLoading) {
    return (
      <IconButton
        rounded="s"
        isFullSize={props.isFullSize || isMobile}
        text={{ id: 'button.pending' }}
        icon={
          <span className="ml-2 flex shrink-0">
            <SpinnerGap size={18} className="animate-spin" />
          </span>
        }
        className="!px-4 !text-md"
      />
    );
  }

  if (loadingBehavior === LoadingBehavior.Disabled && shouldShowLoading) {
    return <Button onClick={handleClick} disabled {...props} />;
  }

  return (
    <Button onClick={handleClick} loading={shouldShowLoading} {...props} />
  );
};

export default ActionButton;
