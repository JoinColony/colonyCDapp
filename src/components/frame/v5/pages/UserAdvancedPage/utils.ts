import { SlotKey, UserSettingsSlot } from '~context/userSettings';
import { UserSettingsHook } from '~hooks/useUserSettings';

export const setFormValuesToLocalStorage = (
  values: Partial<UserSettingsSlot>,
  setSettingsKey: UserSettingsHook['setSettingsKey'],
) => {
  Object.entries(values).forEach(([key, value]: [SlotKey, string | boolean]) =>
    setSettingsKey(key, value),
  );
};
