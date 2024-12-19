import { ClientType } from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { mutateWithAuthRetry } from '~apollo/utils.ts';
import { ContextModule, getContext } from '~context/index.ts';
import {
  type ColonyMetadataFragment,
  GetFullColonyByNameDocument,
  UpdateColonyMetadataDocument,
  type UpdateColonyMetadataMutation,
  type UpdateColonyMetadataMutationVariables,
} from '~gql';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import {
  transactionSetPending,
  transactionSetReady,
} from '~state/transactionState.ts';
import { type Safe } from '~types/graphql.ts';
import { notNull } from '~utils/arrays/index.ts';
import { excludeTypenameKey } from '~utils/objects/index.ts';
import { putError, takeFrom } from '~utils/saga/effects.ts';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  createActionMetadataInDB,
  getUpdatedColonyMetadataChangelog,
  uploadAnnotation,
} from '../utils/index.ts';

function* manageExistingSafesAction({
  payload: {
    colony: { colonyAddress },
    colony,
    safes,
    annotationMessage,
    isRemovingSafes,
    customActionTitle,
  },
  meta: { id: metaId, setTxHash },
  meta,
}: Action<ActionTypes.ACTION_MANAGE_EXISTING_SAFES>) {
  let txChannel;
  try {
    const apolloClient = getContext(ContextModule.ApolloClient);

    txChannel = yield call(getTxChannel, metaId);

    const batchKey = !isRemovingSafes
      ? 'addExistingSafe'
      : 'removeExistingSafes';

    const { manageExistingSafes, annotateManageExistingSafes } =
      yield createTransactionChannels(metaId, [
        'manageExistingSafes',
        'annotateManageExistingSafes',
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

    if (annotationMessage) {
      yield createGroupTransaction(annotateManageExistingSafes, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        ready: false,
      });
    }

    yield takeFrom(
      manageExistingSafes.channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    if (annotationMessage) {
      yield takeFrom(
        annotateManageExistingSafes.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield transactionSetPending(manageExistingSafes.id);

    let updatedColonySafes: Safe[];

    const colonySafes =
      colony.metadata?.safes?.filter(notNull).map(excludeTypenameKey) || [];

    if (!isRemovingSafes) {
      updatedColonySafes = [...colonySafes, ...safes];
    } else {
      updatedColonySafes = colonySafes.filter(
        (safe) =>
          !safes.some(
            (removedSafe) =>
              removedSafe.address === safe.address &&
              removedSafe.chainId === safe.chainId,
          ),
      );
    }

    yield transactionSetReady(manageExistingSafes.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(manageExistingSafes.channel);

    yield createActionMetadataInDB(txHash, { customTitle: customActionTitle });

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateManageExistingSafes,
        message: annotationMessage,
        txHash,
      });
    }

    /**
     * Update colony metadata in the db
     */
    if (colony.metadata) {
      yield mutateWithAuthRetry(() =>
        apolloClient.mutate<
          UpdateColonyMetadataMutation,
          UpdateColonyMetadataMutationVariables
        >({
          mutation: UpdateColonyMetadataDocument,
          variables: {
            input: {
              id: colonyAddress,
              safes: updatedColonySafes,
              changelog: getUpdatedColonyMetadataChangelog({
                transactionHash: txHash,
                metadata: colony.metadata as ColonyMetadataFragment,
                newSafes: updatedColonySafes,
              }),
            },
          },
          // Update colony object with modified metadata
          refetchQueries: [GetFullColonyByNameDocument],
        }),
      );
    }

    yield put<AllActions>({
      type: ActionTypes.ACTION_MANAGE_EXISTING_SAFES_SUCCESS,
      meta,
    });

    setTxHash?.(txHash);
  } catch (error) {
    yield putError(ActionTypes.ACTION_MANAGE_EXISTING_SAFES_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

export default function* manageExistingSafeSaga() {
  yield takeEvery(
    ActionTypes.ACTION_MANAGE_EXISTING_SAFES,
    manageExistingSafesAction,
  );
}
