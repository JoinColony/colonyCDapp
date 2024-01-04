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
} from '~redux/actionCreators';
import { ActionTypes } from '~redux/actionTypes';

import { TransactionChannel } from '../transactions';

import { initiateTransaction, takeFrom } from './effects';
import { ipfsUploadAnnotation } from './ipfs';

export const uploadAnnotationToDb = async ({
  message,
  annotationId,
  ipfsHash,
  actionId,
}: {
  message: string;
  annotationId: string;
  ipfsHash: string;
  actionId: string;
}) => {
  const apolloClient = getContext(ContextModule.ApolloClient);

  await apolloClient.mutate<
    CreateAnnotationMutation,
    CreateAnnotationMutationVariables
  >({
    mutation: CreateAnnotationDocument,
    variables: {
      input: {
        message,
        id: annotationId,
        actionId,
        ipfsHash,
      },
    },
  });
};

export function* uploadAnnotation({
  txChannel,
  message,
  txHash,
  actionId,
}: {
  txChannel: TransactionChannel;
  message: string;
  txHash: string;
  actionId?: string;
}) {
  yield put(transactionPending(txChannel.id));

  /*
   * Upload annotation metadata to IPFS
   */
  const ipfsHash = yield call(ipfsUploadAnnotation, message);

  yield uploadAnnotationToDb({
    message,
    annotationId: txHash,
    // Action id will be the tx hash for all annotations,
    // except for the motion objection annotation. In that case, the tx hash is of
    // the `stakeMotion` action, not of the original action.
    actionId: actionId || txHash,
    ipfsHash,
  });

  yield put(transactionAddParams(txChannel.id, [txHash, ipfsHash]));

  yield initiateTransaction({ id: txChannel.id });

  yield takeFrom(txChannel.channel, ActionTypes.TRANSACTION_SUCCEEDED);
}
