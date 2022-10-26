import { all, call, fork, put } from 'redux-saga/effects';
// import { formatEther } from 'ethers/lib/utils';

// import actionsSagas from './actions';
// import colonySagas, {
//   colonyCreateSaga,
//   colonyFinishDeploymentSaga,
// } from './colony';
// import colonyExtensionSagas from './extensions';
// import motionSagas from './motions';
// import whitelistSagas from './whitelist';
// import vestingSagas from './vesting';
import { setupUsersSagas } from './users';
import { getWallet } from './wallet';

// import { WalletMethod } from '../immutable';
// import { createAddress } from '~utils/web3';
import { ActionTypes } from '../actionTypes';
import { AllActions, Action } from '../types/actions';

import { getContext, setContext, ContextModule } from '~context';
// import { setLastWallet } from '~utils/autoLogin';
// import {
//   refetchUserNotifications,
//   SetLoggedInUserDocument,
//   SetLoggedInUserMutation,
//   SetLoggedInUserMutationVariables,
//   LoggedInUserQuery,
//   LoggedInUserQueryVariables,
//   LoggedInUserDocument,
//   updateNetworkContracts,
// } from '~data/index';

// import setupResolvers from '~context/setupResolvers';
// import AppLoadingState from '~context/appLoadingState';
// import { authenticate, clearToken } from '../../../api';
// import ENS from '~context/ENS';

import {
  // getGasPrices,
  // reinitializeColonyManager,
  putError,
  // createUserWithSecondAttempt,
} from './utils';
import setupOnBeforeUnload from './setupOnBeforeUnload';
// import { setupUserBalanceListener } from './setupUserBalanceListener';

function* setupContextDependentSagas() {
  // const appLoadingState: typeof AppLoadingState = AppLoadingState;
  yield all([
    // call(actionsSagas),
    // call(colonySagas),
    // call(colonyCreateSaga),
    // call(colonyFinishDeploymentSaga),
    // call(colonyExtensionSagas),
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
    // const apolloClient = getContext(ContextModule.ApolloClient);

    /*
     * Get the "old" wallet address, and if it's ethereal, remove it's authetication
     * token from local host as it won't be needed anymore
     */
    // const {
    //   data: {
    //     loggedInUser: {
    //       walletAddress: etherealWalletAddress,
    //       ethereal: isWalletTypeEthereal,
    //     },
    //   },
    // } = yield apolloClient.query<LoggedInUserQuery, LoggedInUserQueryVariables>(
    //   {
    //     query: LoggedInUserDocument,
    //   },
    // );
    // if (isWalletTypeEthereal && etherealWalletAddress) {
    //   clearToken(etherealWalletAddress);
    // }

    /*
     * Get the new wallet and set it in context.
     */
    const wallet = yield call(getWallet);

    setContext(ContextModule.Wallet, wallet);

    yield put<AllActions>({
      type: ActionTypes.WALLET_OPEN_SUCCESS,
    });

    // const walletAddress = createAddress(wallet.address);
    // let walletNetworkId = '1';
    // @ts-ignore
    // if (window.ethereum) {
    // @ts-ignore
    // walletNetworkId = window.ethereum.networkVersion;
    // }
    /*
     * @NOTE Detecting Ganache via it's network id isrc
    ) {
      walletNetworkId = '13131313';
    }

    setContext(ContextModule.Wallet, wallet);

    yield authenticate(wallet);

    yield put<AllActions>({
      type: ActionTypes.WALLET_OPEN_SUCCESS,
      payload: {
        walletType: method,
      },
    });

    yield call(setLastWallet, method, walletAddress);

    const colonyManager = yield call(reinitializeColonyManager);

    yield call(getGasPrices);

    const ens = getContext(ContextModule.ENS);
    */
    // const ens = getContext(ContextModule.ENS);

    // const colonyManager = yield call(reinitializeColonyManager);

    /*
     * This needs to happen first because USER_CONTEXT_SETUP_SUCCESS causes a redirect
     * to dashboard, which needs context for sagas which happen on load.
     * Forking is okay because each `takeEvery` etc happens immediately anyway,
     * but we then do not wait for a return value (which will never come).
     */
    yield fork(setupContextDependentSagas);

    // Start a forked task to listen for user balance events
    // yield fork(setupUserBalanceListener, walletAddress);

    // let username;
    // try {
    //   const domain = yield ens.getDomain(
    //     walletAddress,
    //     colonyManager.networkClient,
    //   );
    //   username = ENS.stripDomainParts('user', domain);

    //   // yield refetchUserNotifications(walletAddress);
    // } catch (caughtError) {
    //   console.info(`Could not find username for ${walletAddress}`);
    // }

    // const balance = yield colonyManager.provider.getBalance(walletAddress);
    // yield balance;

    // @TODO refactor setupUserContext for graphql
    // @BODY eventually we want to move everything to resolvers, so all of this has to happen outside of sagas. There is no need to have a separate state or anything, just set it up in an aync function (instead of WALLET_OPEN), then call this function
    // const ipfsWithFallback = getContext(ContextModule.IPFSWithFallback);
    // const userContext = {
    //   apolloClient,
    //   colonyManager,
    //   ens,
    //   wallet,
    //   // ipfsWithFallback,
    // };
    // yield setupResolvers(apolloClient, userContext);

    // yield createUserWithSecondAttempt(username, true);

    // yield apolloClient.mutate<
    //   SetLoggedInUserMutation,
    //   SetLoggedInUserMutationVariables
    // >({
    //   mutation: SetLoggedInUserDocument,
    //   variables: {
    //     input: {
    //       balance: formatEther(balance),
    //       username,
    //       walletAddress,
    //       ethereal: method === WalletMethod.Ethereal,
    //       networkId: parseInt(walletNetworkId, 10),
    //     },
    //   },
    // });

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
