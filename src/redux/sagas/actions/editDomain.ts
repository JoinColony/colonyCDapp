import { ClientType, ColonyRole, getPermissionProofs } from '@colony/colony-js';
import { call, put, takeEvery } from 'redux-saga/effects';

import { ContextModule, getContext, ColonyManager } from '~context';
import {
  GetFullColonyByNameDocument,
  UpdateDomainMetadataDocument,
  UpdateDomainMetadataMutation,
  UpdateDomainMetadataMutationVariables,
} from '~gql';
import { Action, ActionTypes, AllActions } from '~redux';
import { getDomainDatabaseId } from '~utils/databaseId';

import { transactionPending, transactionAddParams } from '../../actionCreators';
import {
  createGroupTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import {
  putError,
  takeFrom,
  getUpdatedDomainMetadataChangelog,
  uploadAnnotation,
  initiateTransaction,
  getColonyManager,
  createActionMetadataInDB,
} from '../utils';

function* editDomainAction({
  payload: {
    colonyAddress,
    colonyName,
    domainName,
    domainColor,
    domainPurpose,
    domain,
    annotationMessage,
    customActionTitle,
  },
  meta: { id: metaId, navigate, setTxHash },
  meta,
}: Action<ActionTypes.ACTION_DOMAIN_EDIT>) {
  let txChannel;
  try {
    const apolloClient = getContext(ContextModule.ApolloClient);
    const colonyManager: ColonyManager = yield getColonyManager();

    if (!domain) {
      throw new Error('A domain object is required to edit domain');
    }

    txChannel = yield call(getTxChannel, metaId);

    const batchKey = 'editDomainAction';
    const {
      editDomainAction: editDomain,
      annotateEditDomainAction: annotateEditDomain,
    } = yield createTransactionChannels(metaId, [
      'editDomainAction',
      'annotateEditDomainAction',
    ]);

    yield createGroupTransaction(editDomain, batchKey, meta, {
      context: ClientType.ColonyClient,
      methodName: 'editDomain',
      identifier: colonyAddress,
      params: [],
      ready: false,
    });

    if (annotationMessage) {
      yield createGroupTransaction(annotateEditDomain, batchKey, meta, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        ready: false,
      });
    }

    yield takeFrom(editDomain.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateEditDomain.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionPending(editDomain.id));

    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
      colonyClient.networkClient,
      colonyClient,
      domain.nativeId,
      ColonyRole.Architecture,
    );

    yield put(
      transactionAddParams(editDomain.id, [
        permissionDomainId,
        childSkillIndex,
        domain.nativeId,
        /**
         * @NOTE: In order for the DomainMetadata event (which is the only event associated with Edit Domain action) to be emitted,
         * the second parameter must be non-empty.
         * It will be replaced with the IPFS hash in due course.
         */
        '.',
      ]),
    );

    yield initiateTransaction({ id: editDomain.id });

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      editDomain.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield takeFrom(editDomain.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    /**
     * Save the updated metadata in the database
     */
    if (domain.metadata) {
      yield apolloClient.mutate<
        UpdateDomainMetadataMutation,
        UpdateDomainMetadataMutationVariables
      >({
        mutation: UpdateDomainMetadataDocument,
        variables: {
          input: {
            id: getDomainDatabaseId(colonyAddress, domain.nativeId),
            name: domainName,
            color: domainColor,
            description: domainPurpose,
            changelog: getUpdatedDomainMetadataChangelog(
              txHash,
              domain.metadata,
              domainName,
              domainColor,
              domainPurpose,
            ),
          },
        },
        refetchQueries: [GetFullColonyByNameDocument],
      });
    }

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateEditDomain,
        message: annotationMessage,
        txHash,
      });
    }

    yield put<AllActions>({
      type: ActionTypes.ACTION_DOMAIN_EDIT_SUCCESS,
      meta,
    });

    setTxHash?.(txHash);

    if (colonyName && navigate) {
      navigate(`/${colonyName}?tx=${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (error) {
    return yield putError(ActionTypes.ACTION_DOMAIN_EDIT_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* editDomainActionSaga() {
  yield takeEvery(ActionTypes.ACTION_DOMAIN_EDIT, editDomainAction);
}
