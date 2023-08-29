import { ClientType, getChildIndex, Id } from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import {
  SafeTransactionType,
  CreateSafeTransactionDocument,
  CreateSafeTransactionMutation,
  CreateSafeTransactionMutationVariables,
  CreateSafeTransactionDataMutation,
  CreateSafeTransactionDataMutationVariables,
  CreateSafeTransactionDataDocument,
} from '~gql';
import { ADDRESS_ZERO, isDev } from '~constants';
import { ActionTypes } from '~redux/actionTypes';
import { Action, AllActions } from '~redux/types';
import { putError, takeFrom } from '~utils/saga/effects';
import { fill, omit } from '~utils/lodash';
import { ContextModule, getContext } from '~context';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import { getColonyManager } from '../utils';
// import { ipfsUploadAnnotation } from '../utils';
import {
  getRawTransactionData,
  getTransferNFTData,
  getTransferFundsData,
  getContractInteractionData,
  getZodiacModule,
  getHomeBridgeByChain,
  ZODIAC_BRIDGE_MODULE_ADDRESS,
} from '../utils/safeHelpers';
import { transactionReady } from '../../actionCreators';

function* initiateSafeTransactionMotion({
  payload: {
    safe,
    transactions,
    transactionsTitle: title,
    colonyAddress,
    colonyName,
    // annotationMessage,
    motionDomainId,
    network,
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
    const zodiacBridgeModule = getZodiacModule(zodiacBridgeModuleAddress, safe);

    const motionChildSkillIndex = yield call(
      getChildIndex,
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

    const {
      createMotion,
      // annotateInitiateSafeTransactionMotion,
    } = yield createTransactionChannels(metaId, [
      'createMotion',
      // 'annotateInitiateSafeTransactionMotion',
    ]);

    const transactionData: string[] = [];
    /*
     * Calls HomeBridge for each Tx, with the Colony as the sender.
     * Loop necessary as yield cannot be called inside of an array iterator (like forEach).
     */
    /* eslint-disable-next-line no-restricted-syntax */
    for (const transaction of transactions) {
      let txDataToBeSentToZodiacModule = '';
      switch (transaction.transactionType) {
        case SafeTransactionType.RawTransaction:
          txDataToBeSentToZodiacModule = getRawTransactionData(
            zodiacBridgeModule,
            transaction,
          );
          break;
        case SafeTransactionType.TransferNft:
          txDataToBeSentToZodiacModule = getTransferNFTData(
            zodiacBridgeModule,
            safe,
            transaction,
          );
          break;
        case SafeTransactionType.TransferFunds:
          txDataToBeSentToZodiacModule = yield getTransferFundsData(
            zodiacBridgeModule,
            safe,
            transaction,
            network,
          );
          break;
        case SafeTransactionType.ContractInteraction:
          txDataToBeSentToZodiacModule = yield getContractInteractionData(
            zodiacBridgeModule,
            safe,
            transaction,
          );
          break;
        default:
          throw new Error(
            `Unknown transaction type: ${transaction.transactionType}`,
          );
      }

      const txDataToBeSentToAMB = yield homeBridge.interface.encodeFunctionData(
        'requireToPassMessage',
        [zodiacBridgeModule.address, txDataToBeSentToZodiacModule, 1000000],
      );

      transactionData.push(txDataToBeSentToAMB);
    }

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

    // yield fork(createTransaction, annotateInitiateSafeTransactionMotion.id, {
    //   context: ClientType.ColonyClient,
    //   methodName: 'annotateTransaction',
    //   identifier: colonyAddress,
    //   params: [],
    //   group: {
    //     key: batchKey,
    //     id: metaId,
    //     index: 1,
    //   },
    //   ready: false,
    // });

    yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_CREATED);

    // yield takeFrom(
    //   annotateInitiateSafeTransactionMotion.channel,
    //   ActionTypes.TRANSACTION_CREATED,
    // );

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
          title,
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

    // const annotationObject = JSON.stringify(safeTransactionData);
    /*
     * Upload all data via annotationMessage to IPFS.
     * This is to avoid storing the data in the colony metadata.
     */
    // const annotationMessageIpfsHash = yield call(
    //   ipfsUploadAnnotation,
    //   annotationObject,
    // );

    // yield put(transactionPending(annotateInitiateSafeTransactionMotion.id));

    // yield put(
    //   transactionAddParams(annotateInitiateSafeTransactionMotion.id, [
    //     txHash,
    //     annotationMessageIpfsHash,
    //   ]),
    // );

    // yield put(transactionReady(annotateInitiateSafeTransactionMotion.id));

    // yield takeFrom(
    //   annotateInitiateSafeTransactionMotion.channel,
    //   ActionTypes.TRANSACTION_SUCCEEDED,
    // );

    yield put<AllActions>({
      type: ActionTypes.MOTION_INITIATE_SAFE_TRANSACTION_SUCCESS,
      meta,
    });

    yield navigate(`/colony/${colonyName}/tx/${txHash}`, {
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
