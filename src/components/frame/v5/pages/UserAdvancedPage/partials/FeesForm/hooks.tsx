import { bool, object } from 'yup';
import { toast } from 'react-toastify';
import React from 'react';

import useUserSettings, { SlotKey } from '~hooks/useUserSettings';
import Toast from '~shared/Extensions/Toast';
import { canUseMetatransactions } from '~utils/checks';
import { UserSettingsSlot } from '~context/userSettings';
import { setFormValuesToLocalStorage } from '../../utils';

export const useFeesForm = () => {
  const metatransactionsValidationSchema = object({
    [SlotKey.Metatransactions]: bool<boolean>(),
  }).defined();

  const metatransactionsAvailable = canUseMetatransactions();
  const {
    settings: { metatransactions: metatransactionsSetting },
    setSettingsKey,
  } = useUserSettings();

  const metatransasctionsDefault = metatransactionsAvailable
    ? metatransactionsSetting
    : false;

  const handleSubmit = (values: Partial<UserSettingsSlot>) => {
    setFormValuesToLocalStorage(values, setSettingsKey);
  };

  const handleFeesOnChange = (value: boolean) => {
    handleSubmit({ [SlotKey.Metatransactions]: value });
    toast.success(
      <Toast
        type="success"
        title={{ id: 'advancedSettings.fees.toast.title' }}
        description={{
          id: value
            ? 'advancedSettings.fees.toast.description.true'
            : 'advancedSettings.fees.toast.description.false',
        }}
      />,
    );
  };

  return {
    metatransactionsValidationSchema,
    metatransasctionsDefault,
    handleSubmit,
    handleFeesOnChange,
  };
};
