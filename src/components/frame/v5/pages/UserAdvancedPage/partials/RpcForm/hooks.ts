import { string, bool, object } from 'yup';
import { useState } from 'react';

import useUserSettings, { SlotKey } from '~hooks/useUserSettings';
import { yupDebounce } from '~utils/yup/tests';
import {
  isValidURL,
  validateCustomGnosisRPC,
} from '~common/UserProfileEdit/validation';
import { UserSettingsSlot } from '~context/userSettings';
import { setFormValuesToLocalStorage } from '../../utils';

export const useRpcForm = () => {
  const rpcValidationSchema = object({
    [SlotKey.DecentralizedMode]: bool<boolean>(),
    [SlotKey.CustomRPC]: string()
      .defined()
      .when(`${SlotKey.DecentralizedMode}`, {
        is: true,
        then: string()
          .required(() => 'advancedSettings.rpc.errorEmpty')
          .url(() => 'advancedSettings.rpc.error')
          .test(
            'gnosisRpc',
            () => 'advancedSettings.rpc.errorUnable',
            yupDebounce(validateCustomGnosisRPC, 200, {
              isOptional: false,
              circuitBreaker: isValidURL,
            }),
          ),
      }),
  }).defined();

  const {
    settings: { decentralizedModeEnabled, customRpc },
    setSettingsKey,
  } = useUserSettings();

  const [isInputVisible, setIsInputVisible] = useState(
    decentralizedModeEnabled,
  );

  const handleSubmit = (values: Partial<UserSettingsSlot>) => {
    setFormValuesToLocalStorage(values, setSettingsKey);
  };

  const handleDecentarlizedOnChange = (value: boolean) => {
    setIsInputVisible(value);
    handleSubmit(
      value
        ? { [SlotKey.DecentralizedMode]: value }
        : {
            [SlotKey.DecentralizedMode]: value,
            [SlotKey.CustomRPC]: '',
          },
    );
  };

  return {
    rpcValidationSchema,
    isInputVisible,
    setIsInputVisible,
    customRpc,
    handleSubmit,
    decentralizedModeEnabled,
    handleDecentarlizedOnChange,
  };
};
