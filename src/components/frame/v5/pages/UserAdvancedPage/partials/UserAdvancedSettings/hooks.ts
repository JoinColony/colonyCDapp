import { string, bool, object } from 'yup';

import { SlotKey, UserSettingsHook } from '~hooks/useUserSettings';
import { yupDebounce } from '~utils/yup/tests';

import { isValidURL, validateCustomGnosisRPC } from '../../validation';
import { AdvancedSettingsFields } from './types';

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

  return {
    setFormValuesToLocalStorage,
    rpcValidationSchema,
    metatransactionsValidationSchema,
  };
};
