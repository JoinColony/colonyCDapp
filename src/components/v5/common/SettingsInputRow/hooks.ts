import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

export const useSettingsInputRow = () => {
  const {
    register,
    watch,
    formState: { errors, defaultValues, isValid, isDirty },
    resetField,
  } = useFormContext();
  const error = errors.customRpc?.message as string | undefined;
  const customRpcValue = defaultValues?.customRpc ?? '';
  const rpcValue = watch('customRpc');
  const [isInputVisible, setIsInputVisible] = useState(false);

  return {
    register,
    error,
    customRpcValue,
    rpcValue,
    isInputVisible,
    setIsInputVisible,
    resetField,
    isValid,
    isDirty,
  };
};
