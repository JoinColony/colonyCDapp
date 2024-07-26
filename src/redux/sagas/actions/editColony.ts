import { ClientType } from '@colony/colony-js';
import { call, put, takeEvery } from 'redux-saga/effects';

import { ContextModule, getContext } from '~context/index.ts';
import {
  GetFullColonyByNameDocument,
  UpdateColonyMetadataDocument,
  type UpdateColonyMetadataMutation,
  type UpdateColonyMetadataMutationVariables,
} from '~gql';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';
import { isEqual } from '~utils/lodash.ts';

import { transactionSetParams } from '../../../state/transactionState.ts';
import { transactionPending } from '../../actionCreators/index.ts';
import {
  createGroupTransaction,
  createTransactionChannels,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  createActionMetadataInDB,
  getUpdatedColonyMetadataChangelog,
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
} from '../utils/index.ts';
import {
  getExistingTokenAddresses,
  getModifiedTokenAddresses,
  updateColonyTokens,
} from '../utils/updateColonyTokens.ts';

function* editColonyAction({
  payload: {
    colony,
    colony: { colonyAddress, name: colonyName, metadata },
    colonyDisplayName,
    colonyDescription,
    colonyAvatarImage,
    colonyExternalLinks,
    colonyThumbnail,
    tokenAddresses,
    annotationMessage,
    colonyObjective,
    customActionTitle,
  },
  meta: { id: metaId, navigate, setTxHash },
  meta,
}: Action<ActionTypes.ACTION_EDIT_COLONY>) {
  let txChannel;
  try {
    const apolloClient = getContext(ContextModule.ApolloClient);

    txChannel = yield call(getTxChannel, metaId);

    const batchKey = TRANSACTION_METHODS.EditColony;

    const {
      editColonyAction: editColony,
      annotateEditColonyAction: annotateEditColony,
    } = yield createTransactionChannels(metaId, [
      'editColonyAction',
      'annotateEditColonyAction',
    ]);

    yield createGroupTransaction({
      channel: editColony,
      batchKey,
      meta,
      config: {
        context: ClientType.ColonyClient,
        methodName: 'editColony',
        identifier: colonyAddress,
        params: [],
        ready: false,
      },
    });

    if (annotationMessage) {
      yield createGroupTransaction({
        channel: annotateEditColony,
        batchKey,
        meta,
        config: {
          context: ClientType.ColonyClient,
          methodName: 'annotateTransaction',
          identifier: colonyAddress,
          params: [],
          ready: false,
        },
      });
    }

    yield takeFrom(editColony.channel, ActionTypes.TRANSACTION_CREATED);

    if (annotationMessage) {
      yield takeFrom(
        annotateEditColony.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

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
     * the first parameter must be non-empty.
     * It will be replaced with the IPFS hash in due course.
     */
    yield transactionSetParams(editColony.id, ['.']);

    yield initiateTransaction(editColony.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(editColony.channel);

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
            description: colonyDescription,
            externalLinks: colonyExternalLinks,
            objective: colonyObjective,
            changelog: getUpdatedColonyMetadataChangelog({
              transactionHash: txHash,
              metadata: colony.metadata,
              newDisplayName: colonyDisplayName,
              newAvatarImage: colonyAvatarImage,
              haveTokensChanged,
              hasDescriptionChanged:
                metadata?.description !== colonyDescription,
              haveExternalLinksChanged: !isEqual(
                metadata?.externalLinks,
                colonyExternalLinks,
              ),
              hasObjectiveChanged:
                colonyObjective === undefined
                  ? false
                  : !isEqual(metadata?.objective, colonyObjective),
            }),
          },
        },
        refetchQueries: [GetFullColonyByNameDocument],
      });
    }

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateEditColony,
        message: annotationMessage,
        txHash,
      });
    }

    yield put<AllActions>({
      type: ActionTypes.ACTION_EDIT_COLONY_SUCCESS,
      meta,
    });

    setTxHash?.(txHash);

    if (colonyName && navigate) {
      navigate(`/${colonyName}?tx=${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (error) {
    yield putError(ActionTypes.ACTION_EDIT_COLONY_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

export default function* editColonyActionSaga() {
  yield takeEvery(ActionTypes.ACTION_EDIT_COLONY, editColonyAction);
}
