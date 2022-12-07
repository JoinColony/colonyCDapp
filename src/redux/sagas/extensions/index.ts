import { call, all } from 'redux-saga/effects';

import extensionInstallSaga from './extensionInstall';
// import colonyExtensionEnableSaga from './colonyExtensionEnable';
// import colonyExtensionDeprecateSaga from './colonyExtensionDeprecate';
// import colonyExtensionUninstallSaga from './colonyExtensionUninstall';
// import colonyExtensionUpgradeSaga from './colonyExtensionUpgrade';

export default function* extensionsSagas() {
  yield all([
    // call(colonyExtensionUpgradeSaga),
    // call(colonyExtensionUninstallSaga),
    call(extensionInstallSaga),
    // call(colonyExtensionEnableSaga),
    // call(colonyExtensionDeprecateSaga),
  ]);
}
