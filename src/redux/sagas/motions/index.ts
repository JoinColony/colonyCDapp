import { all, call } from 'redux-saga/effects';

import stakeMotionSaga from './stakeMotion';
import voteMotionSaga from './voteMotion';
import revealVoteMotionSaga from './revealVoteMotion';
import finalizeMotionSaga from './finalizeMotion';
import claimMotionRewardsSaga from './claimMotionRewards';
import claimAllMotionRewardsSaga from './claimAllMotionRewards';
import rootMotionSaga from './rootMotion';
import createEditDomainMotionSaga from './createEditDomainMotion';
import moveFundsMotionSaga from './moveFundsMotion';
import managePermissionsMotionSaga from './managePermissionsMotion';
import paymentMotionSaga from './paymentMotion';
// import escalateMotionSaga from './escalateMotion';
import manageReputationMotionSaga from './manageReputationMotion';
import editColonyMotionSaga from './editColonyMotion';
import createDecisionMotionSaga from './createDecisionMotion';
import {
  fundExpenditureMotionSaga,
  cancelStakedExpenditureMotionSaga,
} from './expenditures';
import initiateSafeTransactionMotionSaga from './initiateSafeTransactionMotion';

export default function* actionsSagas() {
  yield all([
    call(stakeMotionSaga),
    call(voteMotionSaga),
    call(revealVoteMotionSaga),
    call(finalizeMotionSaga),
    call(claimMotionRewardsSaga),
    call(claimAllMotionRewardsSaga),
    call(rootMotionSaga),
    call(createEditDomainMotionSaga),
    call(moveFundsMotionSaga),
    call(managePermissionsMotionSaga),
    call(editColonyMotionSaga),
    call(createDecisionMotionSaga),
    call(fundExpenditureMotionSaga),
    call(cancelStakedExpenditureMotionSaga),
    call(paymentMotionSaga),
    // call(escalateMotionSaga),
    call(manageReputationMotionSaga),
    call(initiateSafeTransactionMotionSaga),
  ]);
}
