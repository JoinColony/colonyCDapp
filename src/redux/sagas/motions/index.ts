import { all, call } from 'redux-saga/effects';

import claimAllMotionRewardsSaga from './claimAllMotionRewards';
import claimMotionRewardsSaga from './claimMotionRewards';
// import escalateMotionSaga from './escalateMotion';
import createDecisionMotionSaga from './createDecisionMotion';
import createEditDomainMotionSaga from './createEditDomainMotion';
import editColonyMotionSaga from './editColonyMotion';
import {
  fundExpenditureMotionSaga,
  cancelStakedExpenditureMotionSaga,
} from './expenditures';
import finalizeMotionSaga from './finalizeMotion';
import initiateSafeTransactionMotionSaga from './initiateSafeTransactionMotion';
import managePermissionsMotionSaga from './managePermissionsMotion';
import manageReputationMotionSaga from './manageReputationMotion';
import moveFundsMotionSaga from './moveFundsMotion';
import paymentMotionSaga from './paymentMotion';
import revealVoteMotionSaga from './revealVoteMotion';
import rootMotionSaga from './rootMotion';
import stakeMotionSaga from './stakeMotion';
import voteMotionSaga from './voteMotion';

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
