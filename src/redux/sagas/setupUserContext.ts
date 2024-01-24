import { all, call, fork, put } from 'redux-saga/effects';

// import AppLoadingState from '~context/appLoadingState';

import { authenticateWallet } from '~auth';
import { getContext, setContext, ContextModule } from '~context';
import { ColonyWallet } from '~types/wallet';
import { getLastWallet, LastWallet, setLastWallet } from '~utils/autoLogin';
import { createAddress } from '~utils/web3';

import { ActionTypes } from '../actionTypes';
import { AllActions } from '../types/actions';

import actionsSagas from './actions';
import colonySagas, { colonyCreateSaga } from './colony';
import decisionsSagas from './decisions';
import expendituresSagas from './expenditures';
import extensionSagas from './extensions';
import motionSagas from './motions';
// import { setupUserBalanceListener } from './setupUserBalanceListener';
import { setupTransactionSagas } from './transactions';
import { disconnectWallet, setupUsersSagas } from './users';
import { getGasPrices, putError } from './utils';
import { getBasicWallet, getWallet } from './wallet';
// import vestingSagas from './vesting';
import getOnboard from './wallet/onboard';

const ONBOARD_METAMASK_WALLET_LABEL = 'MetaMask';

const getMetamaskAddress = () => {
  // try/catch just in case createAddress errors
  try {
    if (window.ethereum) {
      return createAddress(
        // @ts-ignore
        window.ethereum.selectedAddress,
      );
    }
  } catch {
    // silent
  }
  return undefined;
};

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
    call(expendituresSagas),
    /**
     * We've loaded all the context sagas, so we can proceed with redering
     * all the app's routes
     */
    // call([appLoadingState, appLoadingState.setIsLoading], false),
  ]);
}

function* initializeBasicWallet(lastWallet: LastWallet) {
  const wallet = yield call(getBasicWallet, lastWallet);
  setContext(ContextModule.Wallet, wallet);
}

function* initializeFullWallet(lastWallet: LastWallet | null) {
  const wallet = yield call(getWallet, lastWallet);
  setContext(ContextModule.Wallet, wallet);
  yield call(getGasPrices);
  yield call(authenticateWallet);
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

    let wallet: ColonyWallet | undefined;

    try {
      wallet = getContext(ContextModule.Wallet);

      const selectedMetamaskAddress = getMetamaskAddress();
      /*
       * If the wallet we've pulled from context does not have the same address as the selected account
       * in Metamask, it's because the user just switched their account in metamask.
       */
      if (
        selectedMetamaskAddress &&
        wallet.address !== selectedMetamaskAddress &&
        wallet.label === ONBOARD_METAMASK_WALLET_LABEL
      ) {
        disconnectWallet(wallet.label); // disconnect previous wallet

        // replace it in local storage with the wallet the user switched to
        setLastWallet({
          type: ONBOARD_METAMASK_WALLET_LABEL,
          address: selectedMetamaskAddress,
        });

        wallet = undefined;
      }
    } catch {
      // wallet not seen in context yet
    }

    const lastWallet = getLastWallet();

    if (!wallet && lastWallet) {
      // Perform quick login, then run background task to fully login
      yield call(initializeBasicWallet, lastWallet);
      yield fork(initializeFullWallet, lastWallet);
    } else {
      // Perfom full wallet login
      yield call(initializeFullWallet, lastWallet);
    }

    yield put<AllActions>({
      type: ActionTypes.WALLET_OPEN_SUCCESS,
    });

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
