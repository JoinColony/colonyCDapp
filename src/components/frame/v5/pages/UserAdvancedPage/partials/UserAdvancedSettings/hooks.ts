import { string, bool, object } from 'yup';

import { useState } from 'react';
import useUserSettings, {
  SlotKey,
  UserSettingsHook,
} from '~hooks/useUserSettings';
import { yupDebounce } from '~utils/yup/tests';

import { isValidURL, validateCustomGnosisRPC } from '../../validation';
import { AdvancedSettingsFields } from './types';
import { canUseMetatransactions } from '~utils/checks';

export const useUserAdvancedPage = () => {
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

  const metatransactionsValidationSchema = object({
    [SlotKey.Metatransactions]: bool<boolean>(),
  }).defined();

  const setFormValuesToLocalStorage = (
    values: Partial<AdvancedSettingsFields>,
    setSettingsKey: UserSettingsHook['setSettingsKey'],
  ) => {
    Object.entries(values).forEach(
      ([key, value]: [SlotKey, string | boolean]) => setSettingsKey(key, value),
    );
  };

  const metatransactionsAvailable = canUseMetatransactions();
  const {
    settings: {
      metatransactions: metatransactionsSetting,
      decentralizedModeEnabled,
      customRpc,
    },
    setSettingsKey,
  } = useUserSettings();
  const [isInputVisible, setIsInputVisible] = useState(
    decentralizedModeEnabled,
  );
  const metatransasctionsDefault = metatransactionsAvailable
    ? metatransactionsSetting
    : false;

  const handleSubmit = (values: Partial<AdvancedSettingsFields>) => {
    setFormValuesToLocalStorage(values, setSettingsKey);
  };

  return {
    rpcValidationSchema,
    metatransactionsValidationSchema,
    metatransasctionsDefault,
    isInputVisible,
    setIsInputVisible,
    customRpc,
    handleSubmit,
    decentralizedModeEnabled,
  };
};
