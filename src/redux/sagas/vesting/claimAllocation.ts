import { call, put, takeEvery, fork } from 'redux-saga/effects';

import { ActionTypes } from '../../actionTypes';
import { AllActions, Action } from '../../types/actions';
import { ExtendedClientType } from '~types';
import {
  UserBalanceWithLockDocument,
  UserBalanceWithLockQuery,
  UserBalanceWithLockQueryVariables,
  ClaimTokensFromMetacolonyDocument,
  ClaimTokensFromMetacolonyQuery,
  ClaimTokensFromMetacolonyQueryVariables,
} from '~data/index';
import { getContext, ContextModule } from '~context';
import { putError, takeFrom } from '../utils';

import { createTransaction, getTxChannel, waitForTxResult } from '../transactions';

function* claimAllocation({
  meta,
  payload,
  payload: { userAddress, colonyAddress, grantsTokenAddress },
}: Action<ActionTypes.META_CLAIM_ALLOCATION>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const apolloClient = getContext(ContextModule.ApolloClient);

    yield fork(createTransaction, meta.id, {
      context: ExtendedClientType.VestingSimpleClient,
      methodName: 'claimGrant',
      identifier: process.env.META_VESTING_CONTRACT_ADDRESS,
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield put<AllActions>({
      type: ActionTypes.META_CLAIM_ALLOCATION_SUCCESS,
      payload,
      meta,
    });

    /*
     *  Refresh queries
     */
    yield apolloClient.query<UserBalanceWithLockQuery, UserBalanceWithLockQueryVariables>({
      query: UserBalanceWithLockDocument,
      variables: {
        address: userAddress,
        tokenAddress: grantsTokenAddress,
        colonyAddress,
      },
      fetchPolicy: 'network-only',
    });

    yield apolloClient.query<ClaimTokensFromMetacolonyQuery, ClaimTokensFromMetacolonyQueryVariables>({
      query: ClaimTokensFromMetacolonyDocument,
      variables: {
        userAddress,
      },
      fetchPolicy: 'network-only',
    });

    yield waitForTxResult(txChannel);
  } catch (error) {
    return yield putError(ActionTypes.META_CLAIM_ALLOCATION_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* claimAllocationSaga() {
  yield takeEvery(ActionTypes.META_CLAIM_ALLOCATION, claimAllocation);
}
