import { all, call, fork, put } from 'redux-saga/effects';

// import AppLoadingState from '~context/appLoadingState';

import { authenticateWallet } from '~auth/index.ts';
import { getContext, setContext, ContextModule } from '~context/index.ts';
import { type ColonyWallet } from '~types/wallet.ts';
import {
  getLastWallet,
  type LastWallet,
  setLastWallet,
} from '~utils/autoLogin.ts';
import { createAddress } from '~utils/web3/index.ts';

import { failPendingTransactions } from '../../state/transactionState.ts';
import { ActionTypes } from '../actionTypes.ts';
import { type AllActions } from '../types/actions/index.ts';

import actionsSagas from './actions/index.ts';
import colonySagas, { colonyCreateSaga } from './colony/index.ts';
import decisionsSagas from './decisions/index.ts';
import expendituresSagas from './expenditures/index.ts';
import extensionSagas from './extensions/index.ts';
import motionSagas from './motions/index.ts';
// import { setupUserBalanceListener } from './setupUserBalanceListener';
import setupTransactionsSaga from './transactions/transactionsToDb.ts';
import { disconnectWallet, setupUsersSagas } from './users/index.ts';
import { getGasPrices, putError } from './utils/index.ts';
import { getBasicWallet, getWallet } from './wallet/index.ts';
// import vestingSagas from './vesting';
import getOnboard from './wallet/onboard.ts';

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
    // call(vestingSagas),
    call(setupUsersSagas),
    call(expendituresSagas),
    call(setupTransactionsSaga),
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
  yield call(failPendingTransactions);
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
