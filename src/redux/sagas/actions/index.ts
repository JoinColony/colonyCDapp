import { all, call } from 'redux-saga/effects';

import createDomainActionSaga from './createDomain';
import editColonyActionSaga from './editColony';
import editDomainActionSaga from './editDomain';
import initiateSafeTransactionSaga from './initiateSafeTransaction';
import manageExistingSafesActionSaga from './manageExistingSafes';
import managePermissionsActionSaga from './managePermissions';
import manageReputationActionSaga from './manageReputation';
import manageVerifiedRecipientsSaga from './manageVerifiedRecipients';
import mintTokensActionSaga from './mintTokens';
import moveFundsActionSaga from './moveFunds';
import paymentActionSaga from './payment';
import unlockTokenActionSaga from './unlockToken';
import versionUpgradeActionSaga from './versionUpgrade';
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
    call(manageVerifiedRecipientsSaga),
    call(manageExistingSafesActionSaga),
    call(initiateSafeTransactionSaga),
  ]);
}
