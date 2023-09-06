import { all, call, fork, put } from 'redux-saga/effects';

import motionSagas from './motions';
import { ColonyWallet, isFullWallet } from '~types';

import actionsSagas from './actions';
import colonySagas, { colonyCreateSaga } from './colony';
import extensionSagas from './extensions';

import decisionsSagas from './decisions';

// import vestingSagas from './vesting';
import { setupUsersSagas } from './users';

import { ActionTypes } from '../actionTypes';
import { AllActions } from '../types/actions';

import { setContext, ContextModule } from '~context';

// import AppLoadingState from '~context/appLoadingState';

import { getGasPrices, putError } from './utils';
import setupWalletContext from './setupWalletContext';
import getOnboard from './wallet/onboard';
import { setupTransactionSagas } from './transactions';
// import { setupUserBalanceListener } from './setupUserBalanceListener';

function* setupContextDependentSagas() {
  // const appLoadingState: typeof AppLoadingState = AppLoadingState;
  yield all([
    call(decisionsSagas),
    call(actionsSagas),
    call(colonySagas),
    call(colonyCreateSaga),
    call(extensionSagas),
    call(motionSagas),
    // call(whitelistSagas),
    // call(vestingSagas),
    call(setupUsersSagas),
    call(setupTransactionSagas),
    /**
     * We've loaded all the context sagas, so we can proceed with redering
     * all the app's routes
     */
    // call([appLoadingState, appLoadingState.setIsLoading], false),
  ]);
}

/*
 * Given an action to get the user’s wallet, use this wallet to initialise the initial
 * context that depends on it (the wallet itself, the DDB, the ColonyManager),
 * and then any other context that depends on that.
 */
export default function* setupUserContext() {
  try {
    /* Instantiate the onboard object and load into context */
    const onboard = yield getOnboard();
    setContext(ContextModule.Onboard, onboard);
    /*
     * Get the new wallet and set it in context.
     */
    const wallet: ColonyWallet | undefined = yield call(setupWalletContext);
    yield put<AllActions>({
      type: ActionTypes.WALLET_OPEN_SUCCESS,
    });

    if (isFullWallet(wallet)) {
      yield call(getGasPrices);
    }

    /*
     * This needs to happen first because USER_CONTEXT_SETUP_SUCCESS causes a redirect
     * to dashboard, which needs context for sagas which happen on load.
     * Forking is okay because each `takeEvery` etc happens immediately anyway,
     * but we then do not wait for a return value (which will never come).
     */
    yield fork(setupContextDependentSagas);

    // const userContext = {
    //   apolloClient,
    //   colonyManager,
    //   wallet,
    // };
    // yield setupResolvers(apolloClient, userContext);

    /*
     * Get the network contract values from the resolver
     */
    // yield updateNetworkContracts();

    yield put<AllActions>({
      type: ActionTypes.USER_CONTEXT_SETUP_SUCCESS,
    });
  } catch (caughtError) {
    return yield putError(ActionTypes.WALLET_OPEN_ERROR, caughtError, {});
  }
  return null;
}
