import { call, all } from 'redux-saga/effects';

import extensionInstallSaga from './extensionInstall';
// import colonyExtensionEnableSaga from './colonyExtensionEnable';
import extensionDeprecateSaga from './extensionDeprecate';
import extensionUninstallSaga from './extensionUninstall';
import extensionUpgradeSaga from './extensionUpgrade';

export default function* extensionsSagas() {
  yield all([
    call(extensionUpgradeSaga),
    call(extensionUninstallSaga),
    call(extensionInstallSaga),
    // call(colonyExtensionEnableSaga),
    call(extensionDeprecateSaga),
  ]);
}
