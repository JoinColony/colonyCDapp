import { call, all } from 'redux-saga/effects';

import extensionDeprecateSaga from './extensionDeprecate';
import extensionEnableSaga from './extensionEnable';
import extensionInstallSaga from './extensionInstall';
import extensionUninstallSaga from './extensionUninstall';
import extensionUpgradeSaga from './extensionUpgrade';

export default function* extensionsSagas() {
  yield all([
    call(extensionUpgradeSaga),
    call(extensionUninstallSaga),
    call(extensionInstallSaga),
    call(extensionEnableSaga),
    call(extensionDeprecateSaga),
  ]);
}
