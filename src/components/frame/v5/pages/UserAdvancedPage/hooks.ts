import { string, bool, object } from 'yup';

import { SlotKey, UserSettingsHook } from '~hooks/useUserSettings';
import { yupDebounce } from '~utils/yup/tests';

import { isValidURL, validateCustomGnosisRPC } from './validation';
import { FormValues } from './types';

export const useUserAdvancedPage = () => {
  const validationSchema = object({
    [SlotKey.Metatransactions]: bool<boolean>(),
    [SlotKey.DecentralizedMode]: bool<boolean>(),
    [SlotKey.CustomRPC]: string()
      .defined()
      .when(`${SlotKey.DecentralizedMode}`, {
        is: true,
        then: string()
          .required(() => 'qwe')
          .url(() => 'qwe')
          .test(
            'gnosisRpc',
            () => 'qwe',
            yupDebounce(validateCustomGnosisRPC, 200, {
              isOptional: false,
              circuitBreaker: isValidURL,
            }),
          ),
      }),
  }).defined();

  const setFormValuesToLocalStorage = (
    values: FormValues,
    setSettingsKey: UserSettingsHook['setSettingsKey'],
  ) => {
    Object.entries(values).forEach(
      ([key, value]: [SlotKey, string | boolean]) => setSettingsKey(key, value),
    );
  };

  return {
    setFormValuesToLocalStorage,
    validationSchema,
  };
};
