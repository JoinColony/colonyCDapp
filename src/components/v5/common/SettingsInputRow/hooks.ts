import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { SlotKey } from '~hooks';

export const useSettingsInputRow = () => {
  const {
    register,
    watch,
    formState: { errors, defaultValues, isValid, isDirty },
    resetField,
  } = useFormContext();
  const error = errors[SlotKey.CustomRPC]?.message as string | undefined;
  const customRpcValue = defaultValues?.[SlotKey.CustomRPC];
  const rpcValue = watch(SlotKey.CustomRPC);
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
