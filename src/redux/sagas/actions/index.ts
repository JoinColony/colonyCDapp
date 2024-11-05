import { all, call } from 'redux-saga/effects';

import arbitraryTxsActionSaga from './arbitrationTxs.ts';
import createDomainActionSaga from './createDomain.ts';
import editColonyActionSaga from './editColony.ts';
import editDomainActionSaga from './editDomain.ts';
import initiateSafeTransactionSaga from './initiateSafeTransaction.ts';
import manageExistingSafesActionSaga from './manageExistingSafes.ts';
import managePermissionsActionSaga from './managePermissions.ts';
import manageReputationActionSaga from './manageReputation.ts';
import manageTokensActionSaga from './manageTokens.ts';
import manageVerifiedMembersActionSaga from './manageVerifiedMembers.ts';
import mintTokensActionSaga from './mintTokens.ts';
import moveFundsActionSaga from './moveFunds.ts';
import paymentActionSaga from './payment.ts';
import unlockTokenActionSaga from './unlockToken.ts';
import versionUpgradeActionSaga from './versionUpgrade.ts';
// import enterRecoveryActionSaga from './enterRecovery';

export default function* actionsSagas() {
  yield all([
    call(mintTokensActionSaga),
    call(paymentActionSaga),
    call(moveFundsActionSaga),
    call(versionUpgradeActionSaga),
    call(createDomainActionSaga),
    call(editDomainActionSaga),
    call(editColonyActionSaga),
    call(managePermissionsActionSaga),
    call(unlockTokenActionSaga),
    // call(enterRecoveryActionSaga),
    call(manageReputationActionSaga),
    call(manageTokensActionSaga),
    call(manageExistingSafesActionSaga),
    call(initiateSafeTransactionSaga),
    call(manageVerifiedMembersActionSaga),
    call(arbitraryTxsActionSaga),
  ]);
}
