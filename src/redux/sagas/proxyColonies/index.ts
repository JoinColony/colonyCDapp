import { all, call } from 'redux-saga/effects';

import createProxyColonySaga from './createProxyColony.ts';
import disableProxyColonySaga from './disableProxyColony.ts';
import enableProxyColonySaga from './enableProxyColony.ts';

export default function* proxyColonySagas() {
  yield all([
    call(createProxyColonySaga),
    call(enableProxyColonySaga),
    call(disableProxyColonySaga),
  ]);
}
