import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { ContextModule, getContext } from '~context';
import { Action, ActionTypes, AllActions } from '~redux';
import {
  CreateColonyTokensDocument,
  CreateColonyTokensMutation,
  CreateColonyTokensMutationVariables,
  DeleteColonyTokensDocument,
  DeleteColonyTokensMutation,
  DeleteColonyTokensMutationVariables,
  GetTokenFromEverywhereDocument,
  GetTokenFromEverywhereQuery,
  GetTokenFromEverywhereQueryVariables,
  UpdateColonyMetadataDocument,
  UpdateColonyMetadataMutation,
  UpdateColonyMetadataMutationVariables,
} from '~gql';
import { notNull } from '~utils/arrays';
import { xor } from '~utils/lodash';
import { ADDRESS_ZERO } from '~constants';

import {
  createTransaction,
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

/**
 * Function returning the token address that was either added to or deleted from modified token addresses list
 * It returns null if there's no difference between the lists
 */
const getModifiedTokenAddress = (
  nativeTokenAddress: string,
  existingTokenAddresses: string[],
  modifiedTokenAddresses?: string[] | null,
) => {
  if (!modifiedTokenAddresses) {
    return null;
  }

  // get a token address that has been modified, excluding colony's native token and chain's default token
  const modifiedTokenAddress = xor(
    existingTokenAddresses,
    modifiedTokenAddresses,
  ).filter(
    (tokenAddress) =>
      tokenAddress !== nativeTokenAddress && tokenAddress !== ADDRESS_ZERO,
  )[0];
  return modifiedTokenAddress ?? null;
};

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

    const existingTokenAddresses =
      colony.tokens?.items
        .filter(notNull)
        .map((tokenItem) => tokenItem?.token.tokenAddress) || [];
    const modifiedTokenAddress = getModifiedTokenAddress(
      colony.nativeToken.tokenAddress,
      existingTokenAddresses,
      tokenAddresses,
    );
    const haveTokensChanged = !!(tokenAddresses && modifiedTokenAddress);

    if (haveTokensChanged) {
      if (tokenAddresses.includes(modifiedTokenAddress)) {
        // token was added
        const response = yield apolloClient.query<
          GetTokenFromEverywhereQuery,
          GetTokenFromEverywhereQueryVariables
        >({
          query: GetTokenFromEverywhereDocument,
          variables: {
            input: {
              tokenAddress: modifiedTokenAddress,
            },
          },
        });

        /**
         * @NOTE Do not create colony/token entry in the db if the token wasn't returned by the GetTokenFromEverywhereQuery.
         * Otherwise, it will cause any query referencing it to fail
         * This case should hopefully be prevented by validation in token management dialog
         */
        if (response?.data.getTokenFromEverywhere?.items?.length) {
          yield apolloClient.mutate<
            CreateColonyTokensMutation,
            CreateColonyTokensMutationVariables
          >({
            mutation: CreateColonyTokensDocument,
            variables: {
              input: {
                colonyID: colony.colonyAddress,
                tokenID: modifiedTokenAddress,
              },
            },
          });
        }
      } else {
        // token was deleted
        // get id of the colony/token entry in the DB (this is separate from either token or colony address)
        const { colonyTokensId } =
          colony.tokens?.items.find(
            (colonyToken) =>
              colonyToken?.token.tokenAddress === modifiedTokenAddress,
          ) || {};

        if (colonyTokensId) {
          yield apolloClient.mutate<
            DeleteColonyTokensMutation,
            DeleteColonyTokensMutationVariables
          >({
            mutation: DeleteColonyTokensDocument,
            variables: {
              input: {
                id: colonyTokensId,
              },
            },
          });
        }
      }
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

    if (colonyName && navigate) {
      yield navigate(`/colony/${colonyName}/tx/${txHash}`);
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
