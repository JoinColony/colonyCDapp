import { ClientType } from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { ContextModule, getContext } from '~context';
import {
  SafeTransactionType,
  CreateSafeTransactionMutation,
  CreateSafeTransactionDocument,
  CreateSafeTransactionMutationVariables,
  CreateSafeTransactionDataMutation,
  CreateSafeTransactionDataDocument,
  CreateSafeTransactionDataMutationVariables,
} from '~gql';
import { ActionTypes } from '~redux/actionTypes';
import { Action, AllActions } from '~redux/types';
import { putError, takeFrom } from '~utils/saga/effects';
import { fill, omit } from '~utils/lodash';
import { ADDRESS_ZERO, isDev } from '~constants';

import { transactionReady } from '../../actionCreators';
import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
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

function* initiateSafeTransactionAction({
  payload: {
    safe,
    transactions,
    transactionsTitle: title,
    colonyAddress,
    colonyName,
    network,
    // annotationMessage = null,
  },
  meta: { id: metaId, navigate },
  meta,
}: Action<ActionTypes.ACTION_INITIATE_SAFE_TRANSACTION>) {
  let txChannel;
  try {
    txChannel = yield call(getTxChannel, metaId);
    const apolloClient = getContext(ContextModule.ApolloClient);

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

      /* eslint-disable-next-line max-len */
      const txDataToBeSentToAMB = yield homeBridge.interface.encodeFunctionData(
        'requireToPassMessage',
        [zodiacBridgeModule.address, txDataToBeSentToZodiacModule, 1000000],
      );

      transactionData.push(txDataToBeSentToAMB);
    }

    const batchKey = 'initiateSafeTransaction';

    const {
      initiateSafeTransaction,
      // annotateInitiateSafeTransaction,
    } = yield createTransactionChannels(metaId, [
      'initiateSafeTransaction',
      // 'annotateInitiateSafeTransaction',
    ]);

    const createGroupTransaction = ({ id, index }, config) =>
      fork(createTransaction, id, {
        ...config,
        group: {
          key: batchKey,
          id: metaId,
          index,
          titleValues: { title },
        },
      });

    yield createGroupTransaction(initiateSafeTransaction, {
      context: ClientType.ColonyClient,
      methodName: 'makeArbitraryTransactions',
      identifier: colonyAddress,
      params: [
        fill(Array(transactionData.length), homeBridge.address),
        transactionData,
        true,
      ],
      ready: false,
      titleValues: { title },
    });

    // yield createGroupTransaction(annotateInitiateSafeTransaction, {
    //   context: ClientType.ColonyClient,
    //   methodName: 'annotateTransaction',
    //   identifier: colonyAddress,
    //   params: [],
    //   ready: false,
    // });

    yield takeFrom(
      initiateSafeTransaction.channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    // yield takeFrom(
    //   annotateInitiateSafeTransaction.channel,
    //   ActionTypes.TRANSACTION_CREATED,
    // );

    yield put(transactionReady(initiateSafeTransaction.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      initiateSafeTransaction.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield takeFrom(
      initiateSafeTransaction.channel,
      ActionTypes.TRANSACTION_SUCCEEDED,
    );

    // yield put(transactionPending(annotateInitiateSafeTransaction.id));

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
            tokenAddress:
              transaction.token?.tokenAddress === ADDRESS_ZERO
                ? `${transaction.token?.tokenAddress}_${network.shortName}`
                : transaction.token?.tokenAddress,
            transactionHash: safeTransaction.data.createSafeTransaction.id,
          },
        },
      });
    }

    // const annotationObject = JSON.stringify(safeTransactionData);

    // let annotationMessageIpfsHash = null;
    // annotationMessageIpfsHash = yield call(
    //   ipfsUploadAnnotation,
    //   annotationObject,
    // );

    // yield put(
    //   transactionAddParams(annotateInitiateSafeTransaction.id, [
    //     txHash,
    //     annotationMessageIpfsHash,
    //   ]),
    // );

    // yield put(transactionReady(annotateInitiateSafeTransaction.id));

    // yield takeFrom(
    //   annotateInitiateSafeTransaction.channel,
    //   ActionTypes.TRANSACTION_SUCCEEDED,
    // );

    yield put<AllActions>({
      type: ActionTypes.ACTION_INITIATE_SAFE_TRANSACTION_SUCCESS,
      meta,
    });

    yield navigate(`/colony/${colonyName}/tx/${txHash}`, {
      state: {
        isRedirect: true,
      },
    });
  } catch (error) {
    return yield putError(
      ActionTypes.ACTION_INITIATE_SAFE_TRANSACTION_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* initiateSafeTransactionSaga() {
  yield takeEvery(
    ActionTypes.ACTION_INITIATE_SAFE_TRANSACTION,
    initiateSafeTransactionAction,
  );
}
