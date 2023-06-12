import { call, fork, put, takeEvery } from 'redux-saga/effects';
import {
  ClientType,
  ColonyRole,
  Extension,
  getChildIndex,
  getPermissionProofs,
  Id,
} from '@colony/colony-js';
import { AddressZero } from '@ethersproject/constants';
import { constants } from 'ethers';

import { ActionTypes } from '../../actionTypes';
import { AllActions, Action } from '../../types/actions';
import { putError, takeFrom, getColonyManager } from '../utils';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import { transactionReady } from '../../actionCreators';

function* moveFundsMotion({
  payload: {
    colonyAddress,
    colonyName,
    colonyVersion,
    fromDomain,
    toDomain,
    amount,
    tokenAddress,
    annotationMessage,
  },
  meta: { id: metaId, navigate },
  meta,
}: Action<ActionTypes.MOTION_MOVE_FUNDS>) {
  let txChannel;
  try {
    /*
     * Validate the required values
     */
    if (!fromDomain) {
      throw new Error(
        'Source domain not set for MoveFundsBetweenPots transaction',
      );
    }
    if (!toDomain) {
      throw new Error(
        'Recipient domain not set for MoveFundsBetweenPots transaction',
      );
    }
    if (!amount) {
      throw new Error(
        'Payment amount not set for MoveFundsBetweenPots transaction',
      );
    }
    if (!tokenAddress) {
      throw new Error(
        'Payment token not set for MoveFundsBetweenPots transaction',
      );
    }

    const colonyManager = yield getColonyManager();
    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );
    const votingReputationClient = yield colonyClient.getExtensionClient(
      Extension.VotingReputation,
    );

    const { nativeFundingPotId: fromPot } = fromDomain;
    const { nativeFundingPotId: toPot } = toDomain;

    const motionChildSkillIndex = yield call(
      getChildIndex,
      colonyClient,
      Id.RootDomain,
      Id.RootDomain,
    );

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      Id.RootDomain,
    );

    const { key, value, branchMask, siblings } = yield call(
      colonyClient.getReputation,
      skillId,
      AddressZero,
    );

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = 'createMotion';

    const { createMotion, annotateMoveFundsMotion } =
      yield createTransactionChannels(metaId, [
        'createMotion',
        'annotateMoveFundsMotion',
      ]);

    const [fromPermissionDomainId, fromChildSkillIndex] = yield call(
      getPermissionProofs,
      colonyClient,
      fromDomain.nativeId,
      [ColonyRole.Funding],
      votingReputationClient.address,
    );

    const [, toChildSkillIndex] = yield call(
      getPermissionProofs,
      colonyClient,
      toDomain.nativeId,
      [ColonyRole.Funding],
      votingReputationClient.address,
    );

    const isOldVersion = colonyVersion <= 6;
    const contractMethod = isOldVersion
      ? `moveFundsBetweenPots(uint256,uint256,uint256,uint256,uint256,uint256,address)`
      : 'moveFundsBetweenPots(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,address)';

    const encodedAction = colonyClient.interface.encodeFunctionData(
      contractMethod,
      [
        ...(isOldVersion ? [] : [fromPermissionDomainId, constants.MaxUint256]),
        fromPermissionDomainId,
        fromChildSkillIndex,
        toChildSkillIndex,
        fromPot,
        toPot,
        amount,
        tokenAddress,
      ],
    );

    // create transactions
    yield fork(createTransaction, createMotion.id, {
      context: ClientType.VotingReputationClient,
      methodName: 'createMotion',
      identifier: colonyAddress,
      params: [
        Id.RootDomain,
        motionChildSkillIndex,
        AddressZero,
        encodedAction,
        key,
        value,
        branchMask,
        siblings,
      ],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateMoveFundsMotion.id, {
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

    yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateMoveFundsMotion.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionReady(createMotion.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      createMotion.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );
    yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    // if (annotationMessage) {
    //   const ipfsHash = yield call(uploadIfpsAnnotation, annotationMessage);
    //   yield put(transactionPending(annotateMoveFundsMotion.id));

    //   yield put(
    //     transactionAddParams(annotateMoveFundsMotion.id, [txHash, ipfsHash]),
    //   );

    //   yield put(transactionReady(annotateMoveFundsMotion.id));

    //   yield takeFrom(
    //     annotateMoveFundsMotion.channel,
    //     ActionTypes.TRANSACTION_SUCCEEDED,
    //   );
    // }
    yield put<AllActions>({
      type: ActionTypes.MOTION_MOVE_FUNDS_SUCCESS,
      meta,
    });

    if (colonyName) {
      navigate(`/colony/${colonyName}/tx/${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (caughtError) {
    putError(ActionTypes.MOTION_MOVE_FUNDS_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* moveFundsMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_MOVE_FUNDS, moveFundsMotion);
}
