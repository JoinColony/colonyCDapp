import { call, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { ContextModule, getContext } from '~context';
import { Action, ActionTypes, AllActions } from '~redux';
import {
  GetFullColonyByNameDocument,
  UpdateColonyMetadataDocument,
  UpdateColonyMetadataMutation,
  UpdateColonyMetadataMutationVariables,
} from '~gql';

import {
  createGroupTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import {
  getUpdatedColonyMetadataChangelog,
  putError,
  takeFrom,
} from '../utils';
import {
  transactionAddParams,
  transactionPending,
  transactionReady,
} from '../../actionCreators';
import {
  getExistingTokenAddresses,
  getModifiedTokenAddresses,
  updateColonyTokens,
} from '../utils/updateColonyTokens';

function* editColonyAction({
  payload: {
    colony,
    colony: { colonyAddress, name: colonyName },
    colonyDisplayName,
    colonyAvatarImage,
    colonyThumbnail,
    tokenAddresses,
  },
  meta: { id: metaId, navigate },
  meta,
}: Action<ActionTypes.ACTION_EDIT_COLONY>) {
  let txChannel;
  try {
    const apolloClient = getContext(ContextModule.ApolloClient);

    txChannel = yield call(getTxChannel, metaId);

    const batchKey = 'editColonyAction';
    const {
      editColonyAction: editColony,
      // annotateEditColonyAction: annotateEditColony,
    } = yield createTransactionChannels(metaId, [
      'editColonyAction',
      'annotateEditColonyAction',
    ]);

    yield createGroupTransaction(editColony, batchKey, meta, {
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

    // /*
    //  * Upload colony metadata to IPFS
    //  *
    //  * @NOTE Only (re)upload the avatar if it has changed, otherwise just use
    //  * the old hash.
    //  * This cuts down on some transaction signing wait time, since IPFS uplaods
    //  * tend to be on the slower side :(
    //  */
    // let colonyAvatarIpfsHash = null;
    // if (colonyAvatarImage && hasAvatarChanged) {
    //   colonyAvatarIpfsHash = yield call(
    //     ipfsUpload,
    //     JSON.stringify({
    //       image: colonyAvatarImage,
    //     }),
    //   );
    // }

    // /*
    //  * Upload colony metadata to IPFS
    //  */
    // let colonyMetadataIpfsHash = null;
    // colonyMetadataIpfsHash = yield call(
    //   ipfsUpload,
    //   JSON.stringify({
    //     colonyDisplayName,
    //     colonyAvatarHash: hasAvatarChanged
    //       ? colonyAvatarIpfsHash
    //       : colonyAvatarHash,
    //     colonyTokens,
    //   }),
    // );

    /**
     * @NOTE: In order for the ColonyMetadata event (which is the only event associated with Colony Edit action) to be emitted,
     * the second parameter must be non-empty.
     * It will be replaced with the IPFS hash in due course.
     */
    yield put(transactionAddParams(editColony.id, ['.']));
    yield put(transactionReady(editColony.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      editColony.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );
    yield takeFrom(editColony.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    const existingTokenAddresses = getExistingTokenAddresses(colony);
    const modifiedTokenAddresses = getModifiedTokenAddresses(
      colony.nativeToken.tokenAddress,
      existingTokenAddresses,
      tokenAddresses,
    );
    const haveTokensChanged = !!(
      tokenAddresses && modifiedTokenAddresses.length
    );

    if (haveTokensChanged) {
      yield updateColonyTokens(
        colony,
        existingTokenAddresses,
        modifiedTokenAddresses,
      );
    }

    /**
     * Save the updated metadata in the database
     */
    if (colony.metadata) {
      yield apolloClient.mutate<
        UpdateColonyMetadataMutation,
        UpdateColonyMetadataMutationVariables
      >({
        mutation: UpdateColonyMetadataDocument,
        variables: {
          input: {
            id: colonyAddress,
            displayName: colonyDisplayName,
            avatar: colonyAvatarImage,
            thumbnail: colonyThumbnail,
            changelog: getUpdatedColonyMetadataChangelog(
              txHash,
              colony.metadata,
              colonyDisplayName,
              colonyAvatarImage,
              false,
              haveTokensChanged,
            ),
          },
        },
        refetchQueries: [GetFullColonyByNameDocument],
      });
    }

    // if (annotationMessage) {
    //   yield put(transactionPending(annotateEditColony.id));

    //   /*
    //    * Upload annotation metadata to IPFS
    //    */
    //   const annotationMessageIpfsHash = yield call(
    //     uploadIfpsAnnotation,
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

    yield put<AllActions>({
      type: ActionTypes.ACTION_EDIT_COLONY_SUCCESS,
      meta,
    });

    if (colonyName) {
      navigate(`/colony/${colonyName}/tx/${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (error) {
    return yield putError(ActionTypes.ACTION_EDIT_COLONY_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* editColonyActionSaga() {
  yield takeEvery(ActionTypes.ACTION_EDIT_COLONY, editColonyAction);
}
