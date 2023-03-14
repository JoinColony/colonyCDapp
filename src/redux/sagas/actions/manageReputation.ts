import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { Action, ActionTypes, AllActions } from '~redux';

import { putError, takeFrom, updateDomainReputation } from '../utils';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import { transactionReady } from '~redux/actionCreators';

function* manageReputationAction({
  payload: {
    colonyAddress,
    colonyName,
    domainId,
    walletAddress,
    amount,
    isSmitingReputation,
    /* annotationMessage */
  },
  meta: { id: metaId, navigate },
  meta,
}: Action<ActionTypes.ACTION_MANAGE_REPUTATION>) {
  let txChannel;
  try {
    const batchKey = isSmitingReputation
      ? 'emitDomainReputationPenalty'
      : 'emitDomainReputationReward';

    if (!walletAddress) {
      throw new Error(`User address not set for ${batchKey} transaction`);
    }

    if (!domainId) {
      throw new Error(`Domain id not set for ${batchKey} transaction`);
    }

    if (!colonyAddress) {
      throw new Error(`Colony address not set for ${batchKey} transaction`);
    }

    txChannel = yield call(getTxChannel, metaId);

    const { manageReputation /* annotateManageReputation */ } =
      yield createTransactionChannels(metaId, [
        'manageReputation',
        // 'annotateManageReputation',
      ]);

    const createGroupTransaction = ({ id, index }, config) =>
      fork(createTransaction, id, {
        ...config,
        group: {
          key: batchKey,
          id: metaId,
          index,
        },
      });

    yield createGroupTransaction(manageReputation, {
      context: ClientType.ColonyClient,
      methodName: isSmitingReputation
        ? 'emitDomainReputationPenaltyWithProofs'
        : 'emitDomainReputationReward',
      identifier: colonyAddress,
      params: [domainId, walletAddress, amount],
      ready: false,
    });

    // if (annotationMessage) {
    //   yield createGroupTransaction(annotateManageReputation, {
    //     context: ClientType.ColonyClient,
    //     methodName: 'annotateTransaction',
    //     identifier: colonyAddress,
    //     params: [],
    //     ready: false,
    //   });
    // }

    yield takeFrom(manageReputation.channel, ActionTypes.TRANSACTION_CREATED);
    // if (annotationMessage) {
    //   yield takeFrom(
    //     annotateManageReputation.channel,
    //     ActionTypes.TRANSACTION_CREATED,
    //   );
    // }

    yield put(transactionReady(manageReputation.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      manageReputation.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield takeFrom(manageReputation.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    // if (annotationMessage) {
    //   yield put(transactionPending(annotateManageReputation.id));

    //   let annotationMessageIpfsHash = null;
    //   annotationMessageIpfsHash = yield call(
    //     ipfsUpload,
    //     JSON.stringify({
    //       annotationMessage,
    //     }),
    //   );

    //   yield put(
    //     transactionAddParams(annotateManageReputation.id, [
    //       txHash,
    //       annotationMessageIpfsHash,
    //     ]),
    //   );

    //   yield put(transactionReady(annotateManageReputation.id));

    //   yield takeFrom(
    //     annotateManageReputation.channel,
    //     ActionTypes.TRANSACTION_SUCCEEDED,
    //   );
    // }

    /*
     * Refesh the user & colony reputation
     */
    yield fork(updateDomainReputation, colonyAddress, walletAddress, domainId);

    yield put<AllActions>({
      type: ActionTypes.ACTION_MANAGE_REPUTATION_SUCCESS,
      meta,
    });

    if (colonyName && navigate) {
      yield navigate(`/colony/${colonyName}/tx/${txHash}`);
    }
  } catch (error) {
    return yield putError(
      ActionTypes.ACTION_MANAGE_REPUTATION_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* manageReputationActionSaga() {
  yield takeEvery(ActionTypes.ACTION_MANAGE_REPUTATION, manageReputationAction);
}
