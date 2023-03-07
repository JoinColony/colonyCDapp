import { all, call } from 'redux-saga/effects';

import mintTokensActionSaga from './mintTokens';
import paymentActionSaga from './payment';
import moveFundsActionSaga from './moveFunds';
// import versionUpgradeActionSaga from './versionUpgrade';
import createDomainActionSaga from './createDomain';
import editDomainActionSaga from './editDomain';
// import editColonyActionSaga from './editColony';
// import managePermissionsActionSaga from './managePermissions';
import unlockTokenActionSaga from './unlockToken';
// import enterRecoveryActionSaga from './enterRecovery';
// import manageReputationActionSaga from './manageReputation';

export default function* actionsSagas() {
  yield all([
    call(mintTokensActionSaga),
    call(paymentActionSaga),
    call(moveFundsActionSaga),
    // call(versionUpgradeActionSaga),
    call(createDomainActionSaga),
    call(editDomainActionSaga),
    // call(editColonyActionSaga),
    // call(managePermissionsActionSaga),
    call(unlockTokenActionSaga),
    // call(enterRecoveryActionSaga),
    // call(manageReputationActionSaga),
  ]);
}
