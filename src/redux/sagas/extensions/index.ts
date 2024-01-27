import { call, all } from 'redux-saga/effects';

import extensionDeprecateSaga from './extensionDeprecate.ts';
import extensionEnableSaga from './extensionEnable.ts';
import extensionInstallSaga from './extensionInstall.ts';
import extensionUninstallSaga from './extensionUninstall.ts';
import extensionUpgradeSaga from './extensionUpgrade.ts';

export default function* extensionsSagas() {
  yield all([
    call(extensionUpgradeSaga),
    call(extensionUninstallSaga),
    call(extensionInstallSaga),
    call(extensionEnableSaga),
    call(extensionDeprecateSaga),
  ]);
}
