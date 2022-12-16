import { call, all } from 'redux-saga/effects';

import extensionInstallSaga from './extensionInstall';
// import colonyExtensionEnableSaga from './colonyExtensionEnable';
import extensionDeprecateSaga from './extensionDeprecate';
import extensionUninstallSaga from './extensionUninstall';
// import colonyExtensionUpgradeSaga from './colonyExtensionUpgrade';

export default function* extensionsSagas() {
  yield all([
    // call(colonyExtensionUpgradeSaga),
    call(extensionUninstallSaga),
    call(extensionInstallSaga),
    // call(colonyExtensionEnableSaga),
    call(extensionDeprecateSaga),
  ]);
}
