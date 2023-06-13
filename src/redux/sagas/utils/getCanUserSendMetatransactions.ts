import { getContext, ContextModule } from '~context';
import { SlotKey } from '~context/userSettings';
import { canUseMetatransactions } from '~utils/checks';

export function* getCanUserSendMetatransactions() {
  const userSettings = yield getContext(ContextModule.UserSettings);
  const userHasMetatransactionEnabled = userSettings.getSlotStorageAtKey(
    SlotKey.Metatransactions,
  );

  const metatransactionsAvailable = canUseMetatransactions();

  return metatransactionsAvailable && userHasMetatransactionEnabled;
}
