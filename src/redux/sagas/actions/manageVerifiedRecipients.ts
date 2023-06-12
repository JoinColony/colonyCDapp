import { ClientType } from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { Action, AllActions, ActionTypes } from '~redux';
import { ContextModule, getContext } from '~context';
import { transactionPending, transactionReady } from '~redux/actionCreators';
import {
  GetFullColonyByNameDocument,
  UpdateColonyMetadataDocument,
  UpdateColonyMetadataMutation,
  UpdateColonyMetadataMutationVariables,
} from '~gql';

import { createTransaction, createTransactionChannels, getTxChannel } from '../transactions';
import { getUpdatedColonyMetadataChangelog, putError, takeFrom } from '../utils';

function* manageVerifiedRecipients({
  payload: {
    colony,
    colony: { colonyAddress },
    colonyDisplayName,
    // colonyAvatarHash,
    verifiedAddresses = [],
    // colonyTokens = [],
    // annotationMessage,
    isWhitelistActivated,
    // colonySafes = [],
  },
  meta: { id: metaId, navigate },
  meta,
}: Action<ActionTypes.ACTION_VERIFIED_RECIPIENTS_MANAGE>) {
  let txChannel;
  try {
    const apolloClient = getContext(ContextModule.ApolloClient);

    /*
     * Validate the required values for the transaction
     */
    if (!colonyDisplayName && colonyDisplayName !== null) {
      throw new Error(`A colony name is required in order to add whitelist addresses to the colony`);
    }

    txChannel = yield call(getTxChannel, metaId);

    const batchKey = 'editColonyAction';
    const {
      editColonyAction: editColony,
      // annotateEditColonyAction: annotateEditColony,
    } = yield createTransactionChannels(metaId, [
      'editColonyAction',
      // 'annotateEditColonyAction',
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

    yield createGroupTransaction(editColony, {
      context: ClientType.ColonyClient,
      methodName: 'editColony',
      identifier: colonyAddress,
      params: [],
      ready: false,
    });

    // if (annotationMessage) {
    //   yield createGroupTransaction(annotateEditColony, {
    //     context: ClientType.ColonyClient,
    //     methodName: 'annotateTransaction',
    //     identifier: colonyAddress,
    //     params: [],
    //     ready: false,
    //   });
    // }

    yield takeFrom(editColony.channel, ActionTypes.TRANSACTION_CREATED);

    // if (annotationMessage) {
    //   yield takeFrom(
    //     annotateEditColony.channel,
    //     ActionTypes.TRANSACTION_CREATED,
    //   );
    // }

    yield put(transactionPending(editColony.id));

    /*
     * Upload colony metadata to IPFS
     */
    // let colonyMetadataIpfsHash = null;

    // colonyMetadataIpfsHash = yield call(
    //   ipfsUploadWithFallback,
    //   getStringForMetadataColony({
    //     colonyDisplayName,
    //     colonyAvatarHash,
    //     verifiedAddresses,
    //     colonyTokens,
    //     isWhitelistActivated,
    //     colonySafes,
    //   }),
    // );

    // yield put(
    //   transactionAddParams(editColony.id, [
    //     (colonyMetadataIpfsHash as unknown) as string,
    //   ]),
    // );

    yield put(transactionReady(editColony.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(editColony.channel, ActionTypes.TRANSACTION_HASH_RECEIVED);
    yield takeFrom(editColony.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    // if (annotationMessage) {
    //   yield put(transactionPending(annotateEditColony.id));

    //   /*
    //    * Upload annotation metadata to IPFS
    //    */
    //   const annotationMessageIpfsHash = yield call(
    //     ipfsUploadAnnotation,
    //     annotationMessage,
    //   );

    //   yield put(
    //     transactionAddParams(annotateEditColony.id, [
    //       txHash,
    //       annotationMessageIpfsHash,
    //     ]),
    //   );

    //   yield put(transactionReady(annotateEditColony.id));

    //   yield takeFrom(
    //     annotateEditColony.channel,
    //     ActionTypes.TRANSACTION_SUCCEEDED,
    //   );
    // }

    /**
     * Update colony metadata in the db
     */
    if (colony.metadata) {
      yield apolloClient.mutate<UpdateColonyMetadataMutation, UpdateColonyMetadataMutationVariables>({
        mutation: UpdateColonyMetadataDocument,
        variables: {
          input: {
            id: colonyAddress,
            isWhitelistActivated,
            whitelistedAddresses: verifiedAddresses,
            changelog: getUpdatedColonyMetadataChangelog(txHash, colony.metadata, undefined, undefined, true),
          },
        },
        // Update colony object with modified metadata
        refetchQueries: [GetFullColonyByNameDocument],
      });
    }

    yield put<AllActions>({
      type: ActionTypes.ACTION_VERIFIED_RECIPIENTS_MANAGE_SUCCESS,
      payload: {},
      meta,
    });

    if (colony.name && navigate) {
      yield navigate(`/colony/${colony.name}/tx/${txHash}`, {
        state: {
          isRedirect: true,
        },
      });
    }
  } catch (error) {
    return yield putError(ActionTypes.ACTION_VERIFIED_RECIPIENTS_MANAGE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* manageVerifiedRecipientsSaga() {
  yield takeEvery(ActionTypes.ACTION_VERIFIED_RECIPIENTS_MANAGE, manageVerifiedRecipients);
}
