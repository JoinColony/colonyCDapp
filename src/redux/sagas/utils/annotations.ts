import { call, put } from 'redux-saga/effects';
import { ContextModule, getContext } from '~context';
import {
  CreateAnnotationDocument,
  CreateAnnotationMutation,
  CreateAnnotationMutationVariables,
} from '~gql';
import {
  transactionAddParams,
  transactionPending,
  transactionReady,
} from '~redux/actionCreators';
import { ipfsUploadAnnotation } from './ipfs';
import { takeFrom } from './effects';
import { ActionTypes } from '~redux/actionTypes';
import { TransactionChannel } from '../transactions';

export const uploadAnnotationToDb = async ({ message, txHash, ipfsHash }) => {
  const apolloClient = getContext(ContextModule.ApolloClient);
  await apolloClient.mutate<
    CreateAnnotationMutation,
    CreateAnnotationMutationVariables
  >({
    mutation: CreateAnnotationDocument,
    variables: {
      input: {
        message,
        id: txHash,
        ipfsHash,
      },
    },
  });
};

export function* uploadAnnotation({
  txChannel,
  message,
  txHash,
}: {
  txChannel: TransactionChannel;
  message: string;
  txHash: string;
}) {
  yield put(transactionPending(txChannel.id));

  /*
   * Upload annotation metadata to IPFS
   */
  const ipfsHash = yield call(ipfsUploadAnnotation, message);

  yield uploadAnnotationToDb({
    message,
    txHash,
    ipfsHash,
  });

  yield put(transactionAddParams(txChannel.id, [txHash, ipfsHash]));

  yield put(transactionReady(txChannel.id));

  yield takeFrom(txChannel.channel, ActionTypes.TRANSACTION_SUCCEEDED);
}
