import { call, put, takeEvery, fork } from 'redux-saga/effects';
import { BigNumber } from 'ethers';

import { ActionTypes } from '../../actionTypes';
import { AllActions, Action } from '../../types/actions';
import { ExtendedReduxContext } from '~types';
import {
  UserBalanceWithLockDocument,
  UserBalanceWithLockQuery,
  UserBalanceWithLockQueryVariables,
  UnwrapTokenForMetacolonyDocument,
  UnwrapTokenForMetacolonyQuery,
  UnwrapTokenForMetacolonyQueryVariables,
} from '~data/index';
import { getContext, ContextModule } from '~context';
import { putError, takeFrom } from '../utils';

import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../transactions';

function* unwrapToken({
  meta,
  payload,
  payload: { amount, userAddress, colonyAddress, unwrappedTokenAddress },
}: Action<ActionTypes.META_UNWRAP_TOKEN>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const apolloClient = getContext(ContextModule.ApolloClient);

    yield fork(createTransaction, meta.id, {
      context: ExtendedReduxContext.WrappedToken,
      methodName: 'withdraw',
      identifier: process.env.META_WRAPPED_TOKEN_ADDRESS,
      params: [BigNumber.from(amount)],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield put<AllActions>({
      type: ActionTypes.META_UNWRAP_TOKEN_SUCCESS,
      payload,
      meta,
    });

    /*
     *  Refresh queries
     */
    yield apolloClient.query<
      UserBalanceWithLockQuery,
      UserBalanceWithLockQueryVariables
    >({
      query: UserBalanceWithLockDocument,
      variables: {
        address: userAddress,
        tokenAddress: unwrappedTokenAddress,
        colonyAddress,
      },
      fetchPolicy: 'network-only',
    });

    yield apolloClient.query<
      UnwrapTokenForMetacolonyQuery,
      UnwrapTokenForMetacolonyQueryVariables
    >({
      query: UnwrapTokenForMetacolonyDocument,
      variables: {
        userAddress,
      },
      fetchPolicy: 'network-only',
    });

    yield waitForTxResult(txChannel);
  } catch (error) {
    return yield putError(ActionTypes.META_UNWRAP_TOKEN_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* unwrapTokenSaga() {
  yield takeEvery(ActionTypes.META_UNWRAP_TOKEN, unwrapToken);
}
