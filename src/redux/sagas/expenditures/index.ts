import { all, call } from 'redux-saga/effects';

import cancelDraftExpenditureSaga from './cancelDraftExpenditure.ts';
import cancelStakedExpenditureSaga from './cancelStakedExpenditure.ts';
import claimExpenditureSaga from './claimExpenditure.ts';
import createExpenditureSaga from './createExpenditure.ts';
import createStakedExpenditureSaga from './createStakedExpenditure.ts';
import createStreamingPaymentSaga from './createStreamingPayment.ts';
import editExpenditureSaga from './editExpenditure.ts';
import finalizeExpenditureSaga from './finalizeExpenditure.ts';
import fundExpenditureSaga from './fundExpenditure.ts';
import lockExpenditureSaga from './lockExpenditure.ts';
import reclaimExpenditureStakeSaga from './reclaimExpenditureStake.ts';
import releaseExpenditureStageSaga from './releaseExpenditureStage.ts';

export default function* expendituresSagas() {
  yield all([
    call(createExpenditureSaga),
    call(lockExpenditureSaga),
    call(finalizeExpenditureSaga),
    call(fundExpenditureSaga),
    call(editExpenditureSaga),
    call(cancelDraftExpenditureSaga),
    call(claimExpenditureSaga),
    call(createStakedExpenditureSaga),
    call(reclaimExpenditureStakeSaga),
    call(releaseExpenditureStageSaga),
    call(cancelStakedExpenditureSaga),
    call(createStreamingPaymentSaga),
  ]);
}
