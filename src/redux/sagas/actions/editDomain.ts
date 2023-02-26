import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { ContextModule, getContext } from '~context';
import { Action, ActionTypes, AllActions } from '~redux';
import {
  UpdateDomainMetadataDocument,
  UpdateDomainMetadataMutation,
  UpdateDomainMetadataMutationVariables,
} from '~gql';
import { getDomainDatabaseId } from '~utils/domains';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import {
  transactionReady,
  transactionPending,
  transactionAddParams,
} from '../../actionCreators';
import { putError, takeFrom, getDomainMetadataChangelog } from '../utils';

function* editDomainAction({
  payload: {
    colonyAddress,
    colonyName,
    domainName,
    domainColor,
    domainPurpose,
    domain,
  },
  meta: { id: metaId, navigate },
  meta,
}: Action<ActionTypes.ACTION_DOMAIN_EDIT>) {
  let txChannel;
  try {
    const apolloClient = getContext(ContextModule.ApolloClient);

    if (!domain) {
      throw new Error('A domain object is required to edit domain');
    }

    txChannel = yield call(getTxChannel, metaId);

    const batchKey = 'editDomainAction';
    const {
      editDomainAction: editDomain,
      // annotateEditDomainAction: annotateEditDomain,
    } = yield createTransactionChannels(metaId, [
      'editDomainAction',
      // 'annotateEditDomainAction',
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

    yield createGroupTransaction(editDomain, {
      context: ClientType.ColonyClient,
      methodName: 'editDomainWithProofs',
      identifier: colonyAddress,
      params: [],
      ready: false,
    });

    // if (annotationMessage) {
    //   yield createGroupTransaction(annotateEditDomain, {
    //     context: ClientType.ColonyClient,
    //     methodName: 'annotateTransaction',
    //     identifier: colonyAddress,
    //     params: [],
    //     ready: false,
    //   });
    // }

    yield takeFrom(editDomain.channel, ActionTypes.TRANSACTION_CREATED);
    // if (annotationMessage) {
    //   yield takeFrom(
    //     annotateEditDomain.channel,
    //     ActionTypes.TRANSACTION_CREATED,
    //   );
    // }

    yield put(transactionPending(editDomain.id));
    yield put(transactionAddParams(editDomain.id, [domain.nativeId, '.']));
    yield put(transactionReady(editDomain.id));

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
            changelog: getDomainMetadataChangelog(
              txHash,
              domain.metadata,
              domainName,
              domainColor,
              domainPurpose,
            ),
          },
        },
      });
    }

    // if (annotationMessage) {
    //   yield put(transactionPending(annotateEditDomain.id));

    //   /*
    //    * Upload annotationMessage to IPFS
    //    */
    //   const annotationMessageIpfsHash = yield call(
    //     uploadIfpsAnnotation,
    //     annotationMessage,
    //   );

    //   yield put(
    //     transactionAddParams(annotateEditDomain.id, [
    //       txHash,
    //       annotationMessageIpfsHash,
    //     ]),
    //   );

    //   yield put(transactionReady(annotateEditDomain.id));

    //   yield takeFrom(
    //     annotateEditDomain.channel,
    //     ActionTypes.TRANSACTION_SUCCEEDED,
    //   );
    // }

    yield put<AllActions>({
      type: ActionTypes.ACTION_DOMAIN_EDIT_SUCCESS,
      meta,
    });

    if (colonyName && navigate) {
      yield navigate(`/colony/${colonyName}/tx/${txHash}`);
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
