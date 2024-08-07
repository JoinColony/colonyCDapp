import { all, call } from 'redux-saga/effects';

import addVerifiedMembersMotionSaga from './addVerifiedMembers.ts';
import claimAllMotionRewardsSaga from './claimAllMotionRewards.ts';
import claimMotionRewardsSaga from './claimMotionRewards.ts';
// import escalateMotionSaga from './escalateMotion';
import createDecisionMotionSaga from './createDecisionMotion.ts';
import createEditDomainMotionSaga from './createEditDomainMotion.ts';
import editColonyMotionSaga from './editColonyMotion.ts';
import {
  fundExpenditureMotionSaga,
  cancelStakedExpenditureMotionSaga,
  releaseExpenditureStageMotionSaga,
  editLockedExpenditureMotionSaga,
  cancelExpenditureMotionSaga,
  finalizeExpenditureMotionSaga,
} from './expenditures/index.ts';
import finalizeMotionSaga from './finalizeMotion.ts';
import initiateSafeTransactionMotionSaga from './initiateSafeTransactionMotion.ts';
import managePermissionsMotionSaga from './managePermissionsMotion.ts';
import manageReputationMotionSaga from './manageReputationMotion.ts';
import manageTokensMotionSaga from './manageTokens.ts';
import moveFundsMotionSaga from './moveFundsMotion.ts';
import paymentMotionSaga from './paymentMotion.ts';
import removeVerifiedMembersMotionSaga from './removeVerifiedMembers.ts';
import revealVoteMotionSaga from './revealVoteMotion.ts';
import rootMotionSaga from './rootMotion.ts';
import stakeMotionSaga from './stakeMotion.ts';
import voteMotionSaga from './voteMotion.ts';

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
    call(cancelExpenditureMotionSaga),
    call(cancelStakedExpenditureMotionSaga),
    call(releaseExpenditureStageMotionSaga),
    call(editLockedExpenditureMotionSaga),
    call(finalizeExpenditureMotionSaga),
    call(paymentMotionSaga),
    // call(escalateMotionSaga),
    call(manageReputationMotionSaga),
    call(initiateSafeTransactionMotionSaga),
    call(addVerifiedMembersMotionSaga),
    call(removeVerifiedMembersMotionSaga),
    call(manageTokensMotionSaga),
  ]);
}
