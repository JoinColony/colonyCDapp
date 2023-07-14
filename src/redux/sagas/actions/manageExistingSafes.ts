import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';
// import {
//   getStringForMetadataColony,
//   getEventMetadataVersion,
// } from '@colony/colony-event-metadata-parser';

import { ContextModule, getContext } from '~context';
import {
  GetFullColonyByNameDocument,
  UpdateColonyMetadataDocument,
  UpdateColonyMetadataMutation,
  UpdateColonyMetadataMutationVariables,
} from '~gql';
import { Safe } from '~types';
import { Action, ActionTypes, AllActions } from '~redux';
import { putError, takeFrom } from '~utils/saga/effects';
import { transactionReady, transactionPending } from '~redux/actionCreators';
import { notNull } from '~utils/arrays';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import { getUpdatedColonyMetadataChangelog } from '../utils';

// import { ipfsUploadAnnotation, ipfsUploadWithFallback } from '../utils';

function* manageExistingSafesAction({
  payload: {
    colony: { colonyAddress, name: colonyName },
    colony,
    safes,
    // annotationMessage,
    isRemovingSafes,
  },
  meta: { id: metaId, navigate },
  meta,
}: Action<ActionTypes.ACTION_MANAGE_EXISTING_SAFES>) {
  let txChannel;
  try {
    const apolloClient = getContext(ContextModule.ApolloClient);
    // const ipfsWithFallback = getContext(ContextModule.IPFSWithFallback);

    txChannel = yield call(getTxChannel, metaId);

    const batchKey = !isRemovingSafes
      ? 'addExistingSafe'
      : 'removeExistingSafes';

    const {
      manageExistingSafesAction: manageExistingSafes,
      // annotateManageExistingSafesAction: annotateManageExistingSafes,
    } = yield createTransactionChannels(metaId, [
      'manageExistingSafesAction',
      // 'annotateManageExistingSafesAction',
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

    yield createGroupTransaction(manageExistingSafes, {
      context: ClientType.ColonyClient,
      methodName: 'editColony',
      identifier: colonyAddress,
      params: [],
      ready: false,
    });

    // if (annotationMessage) {
    //   yield createGroupTransaction(annotateManageExistingSafes, {
    //     context: ClientType.ColonyClient,
    //     methodName: 'annotateTransaction',
    //     identifier: colonyAddress,
    //     params: [],
    //     ready: false,
    //   });
    // }

    yield takeFrom(
      manageExistingSafes.channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    // if (annotationMessage) {
    //   yield takeFrom(
    //     annotateManageExistingSafes.channel,
    //     ActionTypes.TRANSACTION_CREATED,
    //   );
    // }

    yield put(transactionPending(manageExistingSafes.id));

    /*
     * Fetch colony data from the subgraph
     * And destructure the metadata hash.
     */

    // const {
    //   data: {
    //     colony: { metadata: currentMetadataIPFSHash },
    //   },
    // } = yield apolloClient.query<
    //   SubgraphColonyQuery,
    //   SubgraphColonyQueryVariables
    // >({
    //   query: SubgraphColonyDocument,
    //   variables: {
    //     address: colonyAddress.toLowerCase(),
    //   },
    //   fetchPolicy: 'network-only',
    // });

    // const currentMetadata = yield call(
    //   ipfsWithFallback.getString,
    //   currentMetadataIPFSHash,
    // );

    // if (!currentMetadata) {
    //   throw new Error(
    //     `There was an error while fetching the current colony metadata. Please try again later.`,
    //   );
    // }

    // const parsedColonyMetadata = JSON.parse(currentMetadata);
    // const metadataVersion = getEventMetadataVersion(currentMetadata);
    // const currentColonyMetadata =
    //   metadataVersion === 1
    //     ? { ...parsedColonyMetadata }
    //     : parsedColonyMetadata.data;

    let updatedSafes: Safe[];

    const currentColonySafes =
      colony.metadata?.safes
        ?.filter(notNull)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(({ __typename, ...rest }) => rest) || [];

    if (!isRemovingSafes) {
      updatedSafes = [...currentColonySafes, ...safes];
    } else {
      updatedSafes = currentColonySafes.filter(
        (safe) =>
          !safes.some(
            (removedSafe) =>
              removedSafe.address === safe.address &&
              Number(removedSafe.chainId) === safe.chainId,
          ),
      );
    }

    // const colonyMetadata = getStringForMetadataColony(updatedColonyMetadata);
    /*
     * Upload updated metadata object to IPFS
     */

    // const updatedColonyMetadataIpfsHash = yield call(
    //   ipfsUploadWithFallback,
    //   colonyMetadata,
    // );

    // yield put(
    //   transactionAddParams(manageExistingSafes.id, [
    //     (updatedColonyMetadataIpfsHash as unknown) as string,
    //   ]),
    // );

    yield put(transactionReady(manageExistingSafes.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      manageExistingSafes.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield takeFrom(
      manageExistingSafes.channel,
      ActionTypes.TRANSACTION_SUCCEEDED,
    );

    // if (annotationMessage) {
    //   yield put(transactionPending(annotateManageExistingSafes.id));

    //   /*
    //    * Upload annotationMessage to IPFS
    //    */
    //   const annotationMessageIpfsHash = yield call(
    //     ipfsUploadAnnotation,
    //     annotationMessage,
    //   );

    //   yield put(
    //     transactionAddParams(annotateManageExistingSafes.id, [
    //       txHash,
    //       annotationMessageIpfsHash,
    //     ]),
    //   );

    //   yield put(transactionReady(annotateManageExistingSafes.id));

    //   yield takeFrom(
    //     annotateManageExistingSafes.channel,
    //     ActionTypes.TRANSACTION_SUCCEEDED,
    //   );
    // }

    /**
     * Update colony metadata in the db
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
            safes: updatedSafes,
            changelog: getUpdatedColonyMetadataChangelog(
              txHash,
              colony.metadata,
              undefined,
              undefined,
              false,
              false,
              true,
            ),
          },
        },
        // Update colony object with modified metadata
        refetchQueries: [GetFullColonyByNameDocument],
      });
    }

    yield put<AllActions>({
      type: ActionTypes.ACTION_MANAGE_EXISTING_SAFES_SUCCESS,
      meta,
    });

    yield navigate(`/colony/${colonyName}/tx/${txHash}`, {
      state: {
        isRedirect: true,
      },
    });
  } catch (error) {
    return yield putError(
      ActionTypes.ACTION_MANAGE_EXISTING_SAFES_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* manageExistingSafeSaga() {
  yield takeEvery(
    ActionTypes.ACTION_MANAGE_EXISTING_SAFES,
    manageExistingSafesAction,
  );
}
