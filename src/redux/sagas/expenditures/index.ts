import { all, call } from 'redux-saga/effects';

import cancelExpenditureSaga from './cancelExpenditure.ts';
import cancelStakedExpenditureSaga from './cancelStakedExpenditure.ts';
import cancelStreamingPaymentSaga from './cancelStreamingPayment.ts';
import claimExpenditureSaga from './claimExpenditure.ts';
import createExpenditureSaga from './createExpenditure.ts';
import createStakedExpenditureSaga from './createStakedExpenditure.ts';
import createStreamingPaymentSaga from './createStreamingPayment.ts';
import editExpenditureSaga from './editExpenditure.ts';
import finalizeExpenditureSaga from './finalizeExpenditure.ts';
import fundExpenditureSaga from './fundExpenditure.ts';
import lockExpenditureSaga from './lockExpenditure.ts';
import reclaimExpenditureStakeSaga from './reclaimExpenditureStake.ts';
import releaseExpenditureStagesSaga from './releaseExpenditureStages.ts';
import setStakeFractionSaga from './setStakeFraction.ts';

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
    call(releaseExpenditureStagesSaga),
    call(cancelStakedExpenditureSaga),
    call(createStreamingPaymentSaga),
    call(setStakeFractionSaga),
    call(cancelStreamingPaymentSaga),
  ]);
}
