import { call, all } from 'redux-saga/effects';

import extensionInstallSaga from './extensionInstall';
import extensionEnableSaga from './extensionEnable';
import extensionDeprecateSaga from './extensionDeprecate';
import extensionUninstallSaga from './extensionUninstall';
// import colonyExtensionUpgradeSaga from './colonyExtensionUpgrade';

export default function* extensionsSagas() {
  yield all([
    // call(colonyExtensionUpgradeSaga),
    call(extensionUninstallSaga),
    call(extensionInstallSaga),
    call(extensionEnableSaga),
    call(extensionDeprecateSaga),
  ]);
}
