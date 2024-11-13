import { call } from 'redux-saga/effects';

import { mutateWithAuthRetry } from '~apollo/utils.ts';
import { ContextModule, getContext } from '~context/index.ts';
import {
  CreateAnnotationDocument,
  type CreateAnnotationMutation,
  type CreateAnnotationMutationVariables,
} from '~gql';
import {
  transactionSetParams,
  transactionSetPending,
} from '~state/transactionState.ts';

import {
  waitForTxResult,
  type TransactionChannel,
} from '../transactions/index.ts';

import { initiateTransaction } from './effects.ts';
import { ipfsUploadAnnotation } from './ipfs.ts';

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

  await mutateWithAuthRetry(() =>
    apolloClient.mutate<
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
    }),
  );
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
  yield transactionSetPending(txChannel.id);

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

  yield transactionSetParams(txChannel.id, [txHash, ipfsHash]);

  yield initiateTransaction(txChannel.id);

  yield waitForTxResult(txChannel.channel);
}
