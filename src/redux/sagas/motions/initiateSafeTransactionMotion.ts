import { ClientType, getChildIndex, Id } from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { ADDRESS_ZERO, isDev } from '~constants/index.ts';
import { ContextModule, getContext } from '~context/index.ts';
import {
  CreateSafeTransactionDocument,
  type CreateSafeTransactionMutation,
  type CreateSafeTransactionMutationVariables,
  type CreateSafeTransactionDataMutation,
  type CreateSafeTransactionDataMutationVariables,
  CreateSafeTransactionDataDocument,
} from '~gql';
import { ActionTypes } from '~redux/actionTypes.ts';
import { type Action, type AllActions } from '~redux/types/index.ts';
import { fill, omit } from '~utils/lodash.ts';
import { putError, takeFrom } from '~utils/saga/effects.ts';

import { transactionReady } from '../../actionCreators/index.ts';
import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions/index.ts';
import {
  getColonyManager,
  uploadAnnotation,
  createActionMetadataInDB,
} from '../utils/index.ts';
import {
  getHomeBridgeByChain,
  ZODIAC_BRIDGE_MODULE_ADDRESS,
  getTransactionEncodedData,
} from '../utils/safeHelpers.ts';

function* initiateSafeTransactionMotion({
  payload: {
    safe,
    transactions,
    colonyAddress,
    colonyName,
    annotationMessage,
    motionDomainId,
    network,
    customActionTitle,
  },
  meta: { id: metaId, navigate },
  meta,
}: Action<ActionTypes.MOTION_INITIATE_SAFE_TRANSACTION>) {
  let txChannel;
  try {
    txChannel = yield call(getTxChannel, metaId);
    const apolloClient = getContext(ContextModule.ApolloClient);
    const colonyManager = yield getColonyManager();
    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const zodiacBridgeModuleAddress = isDev
      ? ZODIAC_BRIDGE_MODULE_ADDRESS
      : safe.moduleContractAddress;

    if (!zodiacBridgeModuleAddress) {
      throw new Error(
        `Please provide a ZODIAC_BRIDGE_MODULE_ADDRESS. If running local, please add key-pair to your .env file.`,
      );
    }
    const homeBridge = getHomeBridgeByChain(safe.chainId);

    const motionChildSkillIndex = yield call(
      getChildIndex,
      colonyClient.networkClient,
      colonyClient,
      motionDomainId,
      Id.RootDomain,
    );

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      motionDomainId,
    );

    const { key, value, branchMask, siblings } = yield call(
      colonyClient.getReputation,
      skillId,
      ADDRESS_ZERO,
    );

    // setup batch ids and channels
    const batchKey = 'createMotion';

    const { createMotion, annotateInitiateSafeTransaction } =
      yield createTransactionChannels(metaId, [
        'createMotion',
        'annotateInitiateSafeTransaction',
      ]);

    const transactionData: string[] = yield getTransactionEncodedData(
      transactions,
      safe,
      network,
      homeBridge,
    );

    const encodedAction = colonyClient.interface.encodeFunctionData(
      'makeArbitraryTransactions',
      [
        /**
         * The first param of makeArbitraryTransactions is an array of addresses of the receivers. For 1 transactionData, there should be 1 address in the array.
         * All the transactions will be send to the home bridge, therefore we just generate an array filled with the corresponding address.
         *
         */
        fill(Array(transactionData.length), homeBridge.address),
        transactionData,
        true,
      ],
    );

    yield fork(createTransaction, createMotion.id, {
      context: ClientType.VotingReputationClient,
      methodName: 'createMotion',
      identifier: colonyAddress,
      params: [
        motionDomainId,
        motionChildSkillIndex,
        ADDRESS_ZERO,
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
      yield fork(createTransaction, annotateInitiateSafeTransaction.id, {
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
        annotateInitiateSafeTransaction.channel,
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

    /**
     * Create parent safe transaction in the database
     */
    const safeTransaction = yield apolloClient.mutate<
      CreateSafeTransactionMutation,
      CreateSafeTransactionMutationVariables
    >({
      mutation: CreateSafeTransactionDocument,
      variables: {
        input: {
          id: txHash,
          safe,
        },
      },
    });

    /*
     * Create individual safe transaction data records
     */
    for (const transaction of transactions) {
      yield apolloClient.mutate<
        CreateSafeTransactionDataMutation,
        CreateSafeTransactionDataMutationVariables
      >({
        mutation: CreateSafeTransactionDataDocument,
        variables: {
          input: {
            ...omit(transaction, 'token'),
            tokenAddress: transaction.token?.tokenAddress,
            transactionHash: safeTransaction.data.createSafeTransaction.id,
          },
        },
      });
    }

    yield put<AllActions>({
      type: ActionTypes.MOTION_INITIATE_SAFE_TRANSACTION_SUCCESS,
      meta,
    });

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateInitiateSafeTransaction,
        message: annotationMessage,
        txHash,
      });
    }

    yield navigate?.(`/${colonyName}?tx=${txHash}`, {
      state: {
        isRedirect: true,
      },
    });
  } catch (error) {
    return yield putError(
      ActionTypes.MOTION_INITIATE_SAFE_TRANSACTION_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* createInitiateSafeTransactionSaga() {
  yield takeEvery(
    ActionTypes.MOTION_INITIATE_SAFE_TRANSACTION,
    initiateSafeTransactionMotion,
  );
}
