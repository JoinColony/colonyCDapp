import { Id, getChildIndex, ClientType } from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { ActionTypes } from '~redux/actionTypes';
import { transactionReady } from '~redux/actionCreators';
import { Action, AllActions } from '~redux/types';
import { ADDRESS_ZERO } from '~constants';
import { ContextModule, getContext } from '~context';
import {
  CreateColonyMetadataDocument,
  CreateColonyMetadataMutation,
  CreateColonyMetadataMutationVariables,
} from '~gql';
import { getMetadataDatabaseId } from '~utils/domains';
import { getColonyManager, putError, takeFrom } from '../utils';
import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import { getPendingModifiedTokenAddresses } from '../utils/updateColonyTokens';

function* editColonyMotion({
  payload: {
    colony: { colonyAddress, name: colonyName },
    colony,
    colonyDisplayName,
    colonyAvatarImage,
    colonyThumbnail,
    tokenAddresses,
  },
  meta: { id: metaId, navigate },
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

    const { createMotion /* annotateEditColonyMotion */ } =
      yield createTransactionChannels(metaId, [
        'createMotion',
        // 'annotateEditColonyMotion',
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

    // if (annotationMessage) {
    //   yield fork(createTransaction, annotateEditColonyMotion.id, {
    //     context: ClientType.ColonyClient,
    //     methodName: 'annotateTransaction',
    //     identifier: colonyAddress,
    //     params: [],
    //     group: {
    //       key: batchKey,
    //       id: metaId,
    //       index: 1,
    //     },
    //     ready: false,
    //   });
    // }

    yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_CREATED);
    // if (annotationMessage) {
    //   yield takeFrom(
    //     annotateEditColonyMotion.channel,
    //     ActionTypes.TRANSACTION_CREATED,
    //   );
    // }

    yield put(transactionReady(createMotion.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      createMotion.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );
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
            id: getMetadataDatabaseId(colonyAddress, txHash),
            displayName: colonyDisplayName ?? colony.metadata.displayName,
            avatar: colonyAvatarImage,
            thumbnail: colonyThumbnail,
            isWhitelistActivated: colony.metadata.isWhitelistActivated,
            whitelistedAddresses: colony.metadata.whitelistedAddresses,
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
              },
            ],
            modifiedTokenAddresses,
          },
        },
      });
    }

    // if (annotationMessage) {
    //   const ipfsHash = yield call(ipfsUploadAnnotation, annotationMessage);
    //   yield put(transactionPending(annotateEditColonyMotion.id));

    //   yield put(
    //     transactionAddParams(annotateEditColonyMotion.id, [txHash, ipfsHash]),
    //   );

    //   yield put(transactionReady(annotateEditColonyMotion.id));

    //   yield takeFrom(
    //     annotateEditColonyMotion.channel,
    //     ActionTypes.TRANSACTION_SUCCEEDED,
    //   );
    // }

    yield put<AllActions>({
      type: ActionTypes.MOTION_EDIT_COLONY_SUCCESS,
      meta,
    });

    if (colonyName) {
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
