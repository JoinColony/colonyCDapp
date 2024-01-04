import { ClientType } from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { ContextModule, getContext } from '~context';
import {
  GetFullColonyByNameDocument,
  UpdateColonyMetadataDocument,
  UpdateColonyMetadataMutation,
  UpdateColonyMetadataMutationVariables,
} from '~gql';
import { Action, ActionTypes, AllActions } from '~redux';
import { transactionReady, transactionPending } from '~redux/actionCreators';
import { Safe } from '~types';
import { notNull } from '~utils/arrays';
import { excludeTypenameKey } from '~utils/objects';
import { putError, takeFrom } from '~utils/saga/effects';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import {
  createActionMetadataInDB,
  getUpdatedColonyMetadataChangelog,
  uploadAnnotation,
} from '../utils';

function* manageExistingSafesAction({
  payload: {
    colony: { colonyAddress, name: colonyName },
    colony,
    safes,
    annotationMessage,
    isRemovingSafes,
    customActionTitle,
  },
  meta: { id: metaId, navigate },
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

    yield put(transactionPending(manageExistingSafes.id));

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
              Number(removedSafe.chainId) === safe.chainId,
          ),
      );
    }

    yield put(transactionReady(manageExistingSafes.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      manageExistingSafes.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateManageExistingSafes,
        message: annotationMessage,
        txHash,
      });
    }

    yield takeFrom(
      manageExistingSafes.channel,
      ActionTypes.TRANSACTION_SUCCEEDED,
    );

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
            safes: updatedColonySafes,
            changelog: getUpdatedColonyMetadataChangelog(
              txHash,
              colony.metadata,
              undefined,
              undefined,
              false,
              false,
              false,
              false,
              false,
              updatedColonySafes,
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

    yield navigate?.(`/${colonyName}?=${txHash}`, {
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
