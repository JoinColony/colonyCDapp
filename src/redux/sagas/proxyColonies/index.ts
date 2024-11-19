import { all, call } from 'redux-saga/effects';

import createProxyColonySaga from './createProxyColony.ts';

export default function* proxyColonySagas() {
  yield all([call(createProxyColonySaga)]);
}
