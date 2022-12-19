import { Extension, ONE_TX_PAYMENT_VERSION_LATEST } from '@colony/colony-js';
import { InstalledExtensionData } from '~types';

export const oneTxMustBeUpgraded = (extensionData?: InstalledExtensionData) => {
  if (extensionData) {
    const { extensionId: extensionName, version } = extensionData;
    return (
      extensionName === Extension.OneTxPayment &&
      version < ONE_TX_PAYMENT_VERSION_LATEST
    );
  }
  return false;
};
