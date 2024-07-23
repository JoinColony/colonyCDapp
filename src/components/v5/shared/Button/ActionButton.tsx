import { SpinnerGap } from '@phosphor-icons/react';
import React, { type FC, useState } from 'react';

import { useMobile } from '~hooks';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useMounted from '~hooks/useMounted.ts';
import { getFormAction } from '~utils/actions.ts';

import Button from './Button.tsx';
import TxButton from './TxButton.tsx';
import { type ActionButtonProps } from './types.ts';

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
  useTxLoader,
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

  return useTxLoader && (isLoading || loading) ? (
    <TxButton
      rounded="s"
      isFullSize={isMobile}
      text={{ id: 'button.pending' }}
      icon={
        <span className="ml-2 flex shrink-0">
          <SpinnerGap size={18} className="animate-spin" />
        </span>
      }
      className="!px-4 !text-md"
    />
  ) : (
    <Button onClick={handleClick} loading={loading || isLoading} {...props} />
  );
};

export default ActionButton;
