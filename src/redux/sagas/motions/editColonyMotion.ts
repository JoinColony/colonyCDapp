import { Id, getChildIndex, ClientType } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { mutateWithAuthRetry } from '~apollo/utils.ts';
import { PERMISSIONS_NEEDED_FOR_ACTION } from '~constants/actions.ts';
import { ADDRESS_ZERO } from '~constants/index.ts';
import { ContextModule, getContext } from '~context/index.ts';
import {
  type ColonyMetadataFragment,
  CreateColonyMetadataDocument,
  type CreateColonyMetadataMutation,
  type CreateColonyMetadataMutationVariables,
} from '~gql';
import { ActionTypes } from '~redux/actionTypes.ts';
import { type Action, type AllActions } from '~redux/types/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';
import { getPendingMetadataDatabaseId } from '~utils/databaseId.ts';
import { isEqual } from '~utils/lodash.ts';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  createActionMetadataInDB,
  getColonyManager,
  getPermissionProofsLocal,
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
} from '../utils/index.ts';

function* editColonyMotion({
  payload: {
    colony: { colonyAddress },
    colony,
    colonyDisplayName,
    colonyAvatarImage,
    colonyThumbnail,
    colonyDomains,
    colonyRoles,
    isMultiSig,
    colonyDescription,
    colonyExternalLinks,
    annotationMessage,
    customActionTitle,
  },
  meta: { id: metaId, setTxHash },
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

    const userAddress = yield colonyClient.signer.getAddress();

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = TRANSACTION_METHODS.CreateMotion;

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

    // eslint-disable-next-line no-inner-declarations
    function* getCreateMotionParams() {
      if (isMultiSig) {
        const [, childSkillIndex] = yield call(getPermissionProofsLocal, {
          networkClient: colonyClient.networkClient,
          colonyRoles,
          colonyDomains,
          requiredDomainId: Id.RootDomain,
          requiredColonyRoles: PERMISSIONS_NEEDED_FOR_ACTION.EditColonyDetails,
          permissionAddress: userAddress,
          isMultiSig: true,
        });

        return {
          context: ClientType.MultisigPermissionsClient,
          methodName: TRANSACTION_METHODS.CreateMotion,
          identifier: colonyAddress,
          params: [
            Id.RootDomain,
            childSkillIndex,
            [ADDRESS_ZERO],
            [encodedAction],
          ],
          group: {
            key: batchKey,
            id: metaId,
            index: 0,
          },
          ready: false,
        };
      }

      const rootDomain = colonyDomains.find((domain) =>
        BigNumber.from(domain.nativeId).eq(Id.RootDomain),
      );

      if (!rootDomain) {
        throw new Error('Cannot find rootDomain in colony domains');
      }

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

      return {
        context: ClientType.VotingReputationClient,
        methodName: TRANSACTION_METHODS.CreateMotion,
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
      };
    }

    const transactionParams = yield getCreateMotionParams();

    // create transaction
    yield fork(createTransaction, createMotion.id, transactionParams);

    if (annotationMessage) {
      yield fork(createTransaction, annotateEditColonyMotion.id, {
        context: ClientType.ColonyClient,
        methodName: TRANSACTION_METHODS.AnnotateTransaction,
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

    yield initiateTransaction(createMotion.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(createMotion.channel);

    const colonyMetadata = colony.metadata as ColonyMetadataFragment;

    /*
     * Save the pending colony metadata in the database
     */
    if (colony.metadata) {
      yield mutateWithAuthRetry(() =>
        apolloClient.mutate<
          CreateColonyMetadataMutation,
          CreateColonyMetadataMutationVariables
        >({
          mutation: CreateColonyMetadataDocument,
          variables: {
            input: {
              id: getPendingMetadataDatabaseId(colonyAddress, txHash),
              displayName: colonyDisplayName ?? colonyMetadata.displayName,
              avatar: colonyAvatarImage ?? colonyMetadata.avatar,
              thumbnail: colonyThumbnail ?? colonyMetadata.thumbnail,
              description: colonyDescription ?? colonyMetadata.description,
              externalLinks:
                colonyExternalLinks ?? colonyMetadata.externalLinks,
              // We only need a single entry here, as we'll be appending it to the colony's metadata
              // changelog if the motion succeeds.
              changelog: [
                {
                  transactionHash: txHash,
                  newDisplayName:
                    colonyDisplayName ?? colonyMetadata.displayName,
                  oldDisplayName: colonyMetadata.displayName,
                  hasAvatarChanged:
                    colonyAvatarImage === undefined
                      ? false
                      : colonyAvatarImage !== colonyMetadata.avatar,
                  hasDescriptionChanged:
                    colonyMetadata?.description !== colonyDescription,
                  haveExternalLinksChanged: !isEqual(
                    colonyMetadata?.externalLinks,
                    colonyExternalLinks,
                  ),
                  newSafes: colonyMetadata.safes,
                  oldSafes: colonyMetadata.safes,
                },
              ],
            },
          },
        }),
      );
    }

    yield createActionMetadataInDB(txHash, { customTitle: customActionTitle });

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateEditColonyMotion,
        message: annotationMessage,
        txHash,
      });
    }

    setTxHash?.(txHash);

    yield put<AllActions>({
      type: ActionTypes.MOTION_EDIT_COLONY_SUCCESS,
      meta,
    });
  } catch (caughtError) {
    yield putError(ActionTypes.MOTION_EDIT_COLONY_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* editColonyMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_EDIT_COLONY, editColonyMotion);
}
