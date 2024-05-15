import { ClientType, ColonyRole, getPermissionProofs } from '@colony/colony-js';
import { call, put, takeEvery } from 'redux-saga/effects';

import {
  ContextModule,
  getContext,
  type ColonyManager,
} from '~context/index.ts';
import {
  GetFullColonyByNameDocument,
  UpdateDomainMetadataDocument,
  type UpdateDomainMetadataMutation,
  type UpdateDomainMetadataMutationVariables,
} from '~gql';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import { BatchKeys } from '~types/transactions.ts';
import { getDomainDatabaseId } from '~utils/databaseId.ts';

import {
  transactionPending,
  transactionAddParams,
} from '../../actionCreators/index.ts';
import {
  createGroupTransaction,
  createTransactionChannels,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  putError,
  takeFrom,
  getUpdatedDomainMetadataChangelog,
  uploadAnnotation,
  initiateTransaction,
  getColonyManager,
  createActionMetadataInDB,
} from '../utils/index.ts';

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

    const batchKey = BatchKeys.EditDomainAction;

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
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(editDomain.channel);

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

    setTxHash?.(txHash);

    yield put<AllActions>({
      type: ActionTypes.ACTION_DOMAIN_EDIT_SUCCESS,
      meta,
    });

    if (colonyName && navigate) {
      navigate(`/${colonyName}?tx=${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (error) {
    yield putError(ActionTypes.ACTION_DOMAIN_EDIT_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

export default function* editDomainActionSaga() {
  yield takeEvery(ActionTypes.ACTION_DOMAIN_EDIT, editDomainAction);
}
