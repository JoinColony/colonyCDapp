import { call, all } from 'redux-saga/effects';

import extensionDeprecateSaga from './extensionDeprecate.ts';
import extensionEnableSaga from './extensionEnable.ts';
import extensionInstallAndEnableSaga from './extensionInstallAndEnable.ts';
import extensionUninstallSaga from './extensionUninstall.ts';
import extensionUpgradeSaga from './extensionUpgrade.ts';

export default function* extensionsSagas() {
  yield all([
    call(extensionUpgradeSaga),
    call(extensionUninstallSaga),
    call(extensionInstallAndEnableSaga),
    call(extensionEnableSaga),
    call(extensionDeprecateSaga),
  ]);
}
