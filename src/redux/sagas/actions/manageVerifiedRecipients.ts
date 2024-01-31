import { ClientType } from '@colony/colony-js';
import { call, put, takeEvery } from 'redux-saga/effects';

import { ContextModule, getContext } from '~context/index.ts';
import {
  CreateColonyContributorDocument,
  type CreateColonyContributorMutation,
  type CreateColonyContributorMutationVariables,
  GetColonyContributorDocument,
  type GetColonyContributorQuery,
  type GetColonyContributorQueryVariables,
  GetFullColonyByNameDocument,
  UpdateColonyContributorDocument,
  type UpdateColonyContributorMutation,
  type UpdateColonyContributorMutationVariables,
  UpdateColonyMetadataDocument,
  type UpdateColonyMetadataMutation,
  type UpdateColonyMetadataMutationVariables,
} from '~gql';
import { type Action, type AllActions, ActionTypes } from '~redux/index.ts';
import { getColonyContributorId } from '~utils/members.ts';

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

function* manageVerifiedRecipients({
  payload: {
    colony,
    colony: { colonyAddress, name: colonyName },
    colonyDisplayName,
    // colonyAvatarHash,
    verifiedAddresses = [],
    // colonyTokens = [],
    annotationMessage,
    isWhitelistActivated,
    removedAddresses,
    // colonySafes = [],
    customActionTitle,
  },
  meta: { id: metaId, navigate, setTxHash },
  meta,
}: Action<ActionTypes.ACTION_VERIFIED_RECIPIENTS_MANAGE>) {
  let txChannel;

  try {
    const apolloClient = getContext(ContextModule.ApolloClient);

    /*
     * Validate the required values for the transaction
     */
    if (!colonyDisplayName && colonyDisplayName !== null) {
      throw new Error(
        `A colony name is required in order to add whitelist addresses to the colony`,
      );
    }

    txChannel = yield call(getTxChannel, metaId);

    const batchKey = 'editColonyAction';
    const {
      editColonyAction: editColony,
      annotateEditColonyAction: annotateEditColony,
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

    if (annotationMessage) {
      yield createGroupTransaction(annotateEditColony, batchKey, meta, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        ready: false,
      });
    }

    yield takeFrom(editColony.channel, ActionTypes.TRANSACTION_CREATED);

    if (annotationMessage) {
      yield takeFrom(
        annotateEditColony.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    // yield put(transactionPending(editColony.id));

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

    yield initiateTransaction({ id: editColony.id });

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      editColony.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    setTxHash?.(txHash);

    yield waitForTxResult(editColony.channel);

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateEditColony,
        message: annotationMessage,
        txHash,
      });
    }

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
            isWhitelistActivated,
            whitelistedAddresses: verifiedAddresses,
            changelog: getUpdatedColonyMetadataChangelog(
              txHash,
              colony.metadata,
              undefined,
              undefined,
              true,
            ),
          },
        },
        // Update colony object with modified metadata
        refetchQueries: [GetFullColonyByNameDocument],
      });
    }

    yield Promise.all(
      verifiedAddresses.map(async (address) => {
        const { data } = await apolloClient.query<
          GetColonyContributorQuery,
          GetColonyContributorQueryVariables
        >({
          query: GetColonyContributorDocument,
          variables: {
            id: getColonyContributorId(colonyAddress, address),
            colonyAddress,
          },
        });

        const isAlreadyContributor = !!data.getColonyContributor;

        if (isAlreadyContributor) {
          await apolloClient.mutate<
            UpdateColonyContributorMutation,
            UpdateColonyContributorMutationVariables
          >({
            mutation: UpdateColonyContributorDocument,
            variables: {
              input: {
                id: getColonyContributorId(colonyAddress, address),
                isVerified: true,
              },
            },
          });
        } else {
          await apolloClient.mutate<
            CreateColonyContributorMutation,
            CreateColonyContributorMutationVariables
          >({
            mutation: CreateColonyContributorDocument,
            variables: {
              input: {
                id: getColonyContributorId(colonyAddress, address),
                colonyAddress,
                colonyReputationPercentage: 0,
                contributorAddress: address,
                isVerified: true,
              },
            },
          });
        }
      }),
    );

    yield Promise.all(
      removedAddresses.map(async (address) => {
        await apolloClient.mutate<
          UpdateColonyContributorMutation,
          UpdateColonyContributorMutationVariables
        >({
          mutation: UpdateColonyContributorDocument,
          variables: {
            input: {
              id: getColonyContributorId(colonyAddress, address),
              isVerified: false,
            },
          },
        });
      }),
    );

    yield put<AllActions>({
      type: ActionTypes.ACTION_VERIFIED_RECIPIENTS_MANAGE_SUCCESS,
      payload: {},
      meta,
    });

    if (colonyName && navigate) {
      navigate(`/${colonyName}?tx=${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (error) {
    return yield putError(
      ActionTypes.ACTION_VERIFIED_RECIPIENTS_MANAGE_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* manageVerifiedRecipientsSaga() {
  yield takeEvery(
    ActionTypes.ACTION_VERIFIED_RECIPIENTS_MANAGE,
    manageVerifiedRecipients,
  );
}
