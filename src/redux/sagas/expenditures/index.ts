import { all, call } from 'redux-saga/effects';

import createExpenditureSaga from './createExpenditure';
import lockExpenditureSaga from './lockExpenditure';
import finalizeExpenditureSaga from './finalizeExpenditure';
import fundExpenditureSaga from './fundExpenditure';
import editExpenditureSaga from './editExpenditure';
import cancelExpenditureSaga from './cancelExpenditure';
import claimExpenditureSaga from './claimExpenditure';
import createStakedExpenditureSaga from './createStakedExpenditure';
import reclaimExpenditureStakeSaga from './reclaimExpenditureStake';

export default function* expendituresSagas() {
  yield all([
    call(createExpenditureSaga),
    call(lockExpenditureSaga),
    call(finalizeExpenditureSaga),
    call(fundExpenditureSaga),
    call(editExpenditureSaga),
    call(cancelExpenditureSaga),
    call(claimExpenditureSaga),
    call(createStakedExpenditureSaga),
    call(reclaimExpenditureStakeSaga),
  ]);
}
