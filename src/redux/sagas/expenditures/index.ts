import { all, call } from 'redux-saga/effects';

import cancelDraftExpenditureSaga from './cancelDraftExpenditure';
import cancelStakedExpenditureSaga from './cancelStakedExpenditure';
import claimExpenditureSaga from './claimExpenditure';
import createExpenditureSaga from './createExpenditure';
import createStakedExpenditureSaga from './createStakedExpenditure';
import createStreamingPaymentSaga from './createStreamingPayment';
import editExpenditureSaga from './editExpenditure';
import finalizeExpenditureSaga from './finalizeExpenditure';
import fundExpenditureSaga from './fundExpenditure';
import lockExpenditureSaga from './lockExpenditure';
import reclaimExpenditureStakeSaga from './reclaimExpenditureStake';
import releaseExpenditureStageSaga from './releaseExpenditureStage';

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
