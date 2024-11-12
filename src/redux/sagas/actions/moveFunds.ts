import { ClientType } from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { PERMISSIONS_NEEDED_FOR_ACTION } from '~constants/actions.ts';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  putError,
  takeFrom,
  uploadAnnotation,
  getMoveFundsPermissionProofs,
  initiateTransaction,
  createActionMetadataInDB,
  getPermissionProofsLocal,
  getColonyManager,
} from '../utils/index.ts';

function* createMoveFundsAction({
  payload: {
    colonyAddress,
    fromDomain,
    toDomain,
    amount,
    tokenAddress,
    colonyDomains,
    colonyRoles,
    annotationMessage,
    customActionTitle,
  },
  meta: { id: metaId, setTxHash },
  meta,
}: Action<ActionTypes.ACTION_MOVE_FUNDS>) {
  const colonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );
  let txChannel;
  try {
    /*
     * Validate the required values for the payment
     */
    if (!fromDomain) {
      throw new Error(
        'Source domain not set for moveFundsBetweenPots transaction',
      );
    }
    if (!toDomain) {
      throw new Error(
        'Recipient domain not set for moveFundsBetweenPots transaction',
      );
    }
    if (!amount) {
      throw new Error(
        'Payment amount not set for moveFundsBetweenPots transaction',
      );
    }
    if (!tokenAddress) {
      throw new Error(
        'Payment token not set for moveFundsBetweenPots transaction',
      );
    }

    const { nativeFundingPotId: fromPot } = fromDomain;
    const { nativeFundingPotId: toPot } = toDomain;

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = TRANSACTION_METHODS.MoveFunds;

    const userAddress = yield colonyClient.signer.getAddress();
    const { moveFunds, annotateMoveFunds } = yield createTransactionChannels(
      metaId,
      ['moveFunds', 'annotateMoveFunds'],
    );

    const { actionDomainId, fromChildSkillIndex, toChildSkillIndex } =
      yield call(getMoveFundsPermissionProofs, {
        toDomainId: toDomain.nativeId,
        fromDomainId: fromDomain.nativeId,
        colonyDomains,
        colonyAddress,
      });

    const [userPermissionDomainId] = yield call(getPermissionProofsLocal, {
      networkClient: colonyClient.networkClient,
      colonyRoles,
      colonyDomains,
      requiredDomainId: Number(actionDomainId),
      requiredColonyRoles: PERMISSIONS_NEEDED_FOR_ACTION.TransferFunds,
      permissionAddress: userAddress,
    });

    yield fork(createTransaction, moveFunds.id, {
      context: ClientType.ColonyClient,
      methodName:
        'moveFundsBetweenPots(uint256,uint256,uint256,uint256,uint256,uint256,address)',
      identifier: colonyAddress,
      params: [
        userPermissionDomainId,
        fromChildSkillIndex,
        toChildSkillIndex,
        fromPot,
        toPot,
        amount,
        tokenAddress,
      ],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateMoveFunds.id, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        group: {
          key: batchKey,
          id: metaId,
          index: 1,
        },
        ready: false,
      });
    }

    yield takeFrom(moveFunds.channel, ActionTypes.TRANSACTION_CREATED);

    if (annotationMessage) {
      yield takeFrom(
        annotateMoveFunds.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield initiateTransaction(moveFunds.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(moveFunds.channel);

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateMoveFunds,
        message: annotationMessage,
        txHash,
      });
    }

    setTxHash?.(txHash);

    yield put<AllActions>({
      type: ActionTypes.ACTION_MOVE_FUNDS_SUCCESS,
      meta,
    });
  } catch (caughtError) {
    yield putError(ActionTypes.ACTION_MOVE_FUNDS_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* moveFundsActionSaga() {
  yield takeEvery(ActionTypes.ACTION_MOVE_FUNDS, createMoveFundsAction);
}
