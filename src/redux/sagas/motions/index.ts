import { all, call } from 'redux-saga/effects';

import arbitraryTxMotionSaga from './arbitraryTx.ts';
import claimAllMotionRewardsSaga from './claimAllMotionRewards.ts';
import claimMotionRewardsSaga from './claimMotionRewards.ts';
// import escalateMotionSaga from './escalateMotion';
import createDecisionMotionSaga from './createDecisionMotion.ts';
import createEditDomainMultiSigMotionSaga from './domains/createEditDomainMultiSigMotion.ts';
import createEditDomainReputationMotionSaga from './domains/createEditDomainReputationMotion.ts';
import editColonyMotionSaga from './editColonyMotion.ts';
import {
  fundExpenditureMotionSaga,
  cancelStakedExpenditureMotionSaga,
  releaseExpenditureStagesMotionSaga,
  editLockedExpenditureMotionSaga,
  cancelExpenditureMotionSaga,
  finalizeExpenditureMotionSaga,
} from './expenditures/index.ts';
import finalizeMotionSaga from './finalizeMotion.ts';
import initiateSafeTransactionMotionSaga from './initiateSafeTransactionMotion.ts';
import managePermissionsMotionSaga from './managePermissionsMotion.ts';
import manageReputationMotionSaga from './manageReputationMotion.ts';
import manageTokensMotionSaga from './manageTokens.ts';
import manageVerifiedMembersMotionSaga from './manageVerifiedMembers.ts';
import moveFundsMotionSaga from './moveFundsMotion.ts';
import paymentMotionSaga from './paymentMotion.ts';
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
    call(createEditDomainReputationMotionSaga),
    call(createEditDomainMultiSigMotionSaga),
    call(moveFundsMotionSaga),
    call(managePermissionsMotionSaga),
    call(manageVerifiedMembersMotionSaga),
    call(editColonyMotionSaga),
    call(createDecisionMotionSaga),
    call(fundExpenditureMotionSaga),
    call(cancelExpenditureMotionSaga),
    call(cancelStakedExpenditureMotionSaga),
    call(releaseExpenditureStagesMotionSaga),
    call(editLockedExpenditureMotionSaga),
    call(finalizeExpenditureMotionSaga),
    call(paymentMotionSaga),
    // call(escalateMotionSaga),
    call(manageReputationMotionSaga),
    call(initiateSafeTransactionMotionSaga),
    call(manageTokensMotionSaga),
    call(arbitraryTxMotionSaga),
  ]);
}
