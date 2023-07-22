import { all, call } from 'redux-saga/effects';

import createExpenditureSaga from './createExpenditure';

export default function* expendituresSagas() {
  yield all([call(createExpenditureSaga)]);
}
