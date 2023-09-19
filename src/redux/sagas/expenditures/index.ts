import { all, call } from 'redux-saga/effects';

import createExpenditureSaga from './createExpenditure';
import lockExpenditureSaga from './lockExpenditure';
import finalizeExpenditureSaga from './finalizeExpenditure';
import fundExpenditureSaga from './fundExpenditure';
import editExpenditureSaga from './editExpenditure';
import cancelDraftExpenditureSaga from './cancelDraftExpenditure';
import claimExpenditureSaga from './claimExpenditure';
import createStakedExpenditureSaga from './createStakedExpenditure';
import reclaimExpenditureStakeSaga from './reclaimExpenditureStake';
import releaseExpenditureStageSaga from './releaseExpenditureStage';
import cancelStakedExpenditureSaga from './cancelStakedExpenditure';
import createStreamingPaymentSaga from './createStreamingPayment';

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
