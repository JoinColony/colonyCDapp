import { Id, getChildIndex, ClientType } from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { isEqual } from '~utils/lodash';
import { ActionTypes } from '~redux/actionTypes';
import { Action, AllActions } from '~redux/types';
import { ADDRESS_ZERO } from '~constants';
import { ContextModule, getContext } from '~context';
import {
  CreateColonyMetadataDocument,
  CreateColonyMetadataMutation,
  CreateColonyMetadataMutationVariables,
} from '~gql';
import { getPendingMetadataDatabaseId } from '~utils/databaseId';

import {
  createActionMetadataInDB,
  getColonyManager,
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
} from '../utils';
import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import { getPendingModifiedTokenAddresses } from '../utils/updateColonyTokens';

function* editColonyMotion({
  payload: {
    colony: { colonyAddress, name: colonyName, metadata },
    colony,
    colonyDisplayName,
    colonyAvatarImage,
    colonyThumbnail,
    tokenAddresses,
    colonyDescription,
    colonyExternalLinks,
    annotationMessage,
    colonyObjective,
    customActionTitle,
  },
  meta: { id: metaId, navigate, setTxHash },
  meta,
}: Action<ActionTypes.MOTION_EDIT_COLONY>) {
  let txChannel;
  try {
    const apolloClient = getContext(ContextModule.ApolloClient);
    const colonyManager = yield getColonyManager();

    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const childSkillIndex = yield call(
      getChildIndex,
      colonyClient.networkClient,
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
      ADDRESS_ZERO,
    );

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = 'createMotion';

    const { createMotion, annotateEditColonyMotion } =
      yield createTransactionChannels(metaId, [
        'createMotion',
        'annotateEditColonyMotion',
      ]);

    /*
     * Upload colony metadata to IPFS
     *
     * @NOTE Only (re)upload the avatar if it has changed, otherwise just use
     * the old hash.
     * This cuts down on some transaction signing wait time, since IPFS uplaods
     * tend to be on the slower side :(
     */
    // let colonyAvatarIpfsHash = null;
    // if (colonyAvatarImage && hasAvatarChanged) {
    //   colonyAvatarIpfsHash = yield call(
    //     ipfsUploadWithFallback,
    //     getStringForColonyAvatarImage(colonyAvatarImage),
    //   );
    // }

    /*
     * Upload colony metadata to IPFS
     */
    // let colonyMetadataIpfsHash = null;
    // colonyMetadataIpfsHash = yield call(
    //   ipfsUploadWithFallback,
    //   getStringForMetadataColony({
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

    const encodedAction = colonyClient.interface.encodeFunctionData(
      'editColony(string)',
      ['.'],
    );

    // create transaction
    yield fork(createTransaction, createMotion.id, {
      context: ClientType.VotingReputationClient,
      methodName: 'createMotion',
      identifier: colonyAddress,
      params: [
        Id.RootDomain,
        childSkillIndex,
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
      yield fork(createTransaction, annotateEditColonyMotion.id, {
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
        annotateEditColonyMotion.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield initiateTransaction({ id: createMotion.id });

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      createMotion.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    setTxHash?.(txHash);
    yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    const modifiedTokenAddresses = getPendingModifiedTokenAddresses(
      colony,
      tokenAddresses,
    );

    const haveTokensChanged = !!(
      modifiedTokenAddresses.added.length ||
      modifiedTokenAddresses.removed.length
    );

    /*
     * Save the pending colony metadata in the database
     */
    if (colony.metadata) {
      yield apolloClient.mutate<
        CreateColonyMetadataMutation,
        CreateColonyMetadataMutationVariables
      >({
        mutation: CreateColonyMetadataDocument,
        variables: {
          input: {
            id: getPendingMetadataDatabaseId(colonyAddress, txHash),
            displayName: colonyDisplayName ?? colony.metadata.displayName,
            avatar: colonyAvatarImage,
            thumbnail: colonyThumbnail,
            description: colonyDescription,
            externalLinks: colonyExternalLinks,
            isWhitelistActivated: colony.metadata.isWhitelistActivated,
            whitelistedAddresses: colony.metadata.whitelistedAddresses,
            objective: colonyObjective,
            // We only need a single entry here, as we'll be appending it to the colony's metadata
            // changelog if the motion succeeds.
            changelog: [
              {
                transactionHash: txHash,
                newDisplayName:
                  colonyDisplayName ?? colony.metadata.displayName,
                oldDisplayName: colony.metadata.displayName,
                hasAvatarChanged:
                  colonyAvatarImage === undefined
                    ? false
                    : colonyAvatarImage !== colony.metadata.avatar,
                hasWhitelistChanged: false,
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
                newSafes: colony.metadata.safes,
                oldSafes: colony.metadata.safes,
              },
            ],
            modifiedTokenAddresses,
          },
        },
      });
    }

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateEditColonyMotion,
        message: annotationMessage,
        txHash,
      });
    }

    yield put<AllActions>({
      type: ActionTypes.MOTION_EDIT_COLONY_SUCCESS,
      meta,
    });

    if (colonyName && navigate) {
      navigate(`/colony/${colonyName}/tx/${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (caughtError) {
    putError(ActionTypes.MOTION_EDIT_COLONY_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* editColonyMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_EDIT_COLONY, editColonyMotion);
}
