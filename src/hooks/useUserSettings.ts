import { useState } from 'react';
import { ContextModule, getContext } from '~context';
import { SlotKey, UserSettingsSlot } from '~context/userSettings';

export interface UserSettingsHook {
  settings: UserSettingsSlot;
  setSettingsKey: <K extends SlotKey>(
    key: K,
    value: UserSettingsSlot[K],
  ) => UserSettingsSlot[K];
  getSettingsKey: <K extends SlotKey>(key: K) => UserSettingsSlot[K];
}

export { SlotKey };

const useUserSettings = (): UserSettingsHook => {
  const userSettings = getContext(ContextModule.UserSettings);

  const [settingsState, updateSettingsState] = useState<UserSettingsSlot>(
    userSettings.getStorageSlot() as UserSettingsSlot,
  );

  const setSettingsKey = <K extends SlotKey>(
    key: K,
    value: UserSettingsSlot[K],
  ): UserSettingsSlot[K] => {
    const settingsKeyUpdate = userSettings.setSlotStorageAtKey(
      key,
      value,
    ) as UserSettingsSlot[K];
    updateSettingsState(userSettings.getStorageSlot() as UserSettingsSlot);
    return settingsKeyUpdate;
  };

  const getSettingsKey = <K extends SlotKey>(key: K): UserSettingsSlot[K] =>
    settingsState[key];

  return {
    settings: settingsState,
    setSettingsKey,
    getSettingsKey,
  };
};

export default useUserSettings;
