import { all, call, fork, put } from 'redux-saga/effects';
// import { formatEther } from 'ethers/lib/utils';

import actionsSagas from './actions';
import colonySagas, { colonyCreateSaga } from './colony';
import extensionSagas from './extensions';
import { setContext, ContextModule, UserSettings } from '~context';
import { ColonyWallet } from '~types';

// import actionsSagas from './actions';
// import colonySagas, {
// } from './colony';
// import colonyExtensionSagas from './extensions';
// import motionSagas from './motions';
// import whitelistSagas from './whitelist';
// import vestingSagas from './vesting';
import { setupUsersSagas } from './users';

import { ActionTypes } from '../actionTypes';
import { AllActions } from '../types/actions';

// import setupResolvers from '~context/setupResolvers';
// import AppLoadingState from '~context/appLoadingState';

import { getGasPrices, putError } from './utils';
import setupOnBeforeUnload from './setupOnBeforeUnload';
import setupWalletContext from './setupWalletContext';
// import { setupUserBalanceListener } from './setupUserBalanceListener';

function* setupContextDependentSagas() {
  // const appLoadingState: typeof AppLoadingState = AppLoadingState;
  yield all([
    call(actionsSagas),
    call(colonySagas),
    call(colonyCreateSaga),
    call(extensionSagas),
    // call(motionSagas),
    // call(whitelistSagas),
    // call(vestingSagas),
    call(setupUsersSagas),
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
    /*
     * Get the new wallet and set it in context.
     */
    const wallet: ColonyWallet | undefined = yield call(setupWalletContext);
    yield put<AllActions>({
      type: ActionTypes.WALLET_OPEN_SUCCESS,
    });

    /*
     * Get user settings and hydrate them in the context
     *
     * In case the user is just browsing and didn't log in (ethereal wallet),
     * don't pass the address to the settings context, so as to not pollute
     * the local storage namespace.
     * This way it will save, and override all settings in the 000000... slot key
     */
    if (wallet?.address) {
      const userSettings = new UserSettings(wallet.address);
      setContext(ContextModule.UserSettings, userSettings);
    }

    yield call(getGasPrices);

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

    setupOnBeforeUnload();

    yield put<AllActions>({
      type: ActionTypes.USER_CONTEXT_SETUP_SUCCESS,
    });
  } catch (caughtError) {
    return yield putError(ActionTypes.WALLET_OPEN_ERROR, caughtError, {});
  }
  return null;
}
