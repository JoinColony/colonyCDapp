import { call, put, takeEvery } from 'redux-saga/effects';
import { ClientType, Id } from '@colony/colony-js';

import { Action, ActionTypes, AllActions } from '~redux';
import {
  transactionAddParams,
  transactionPending,
  transactionReady,
} from '~redux/actionCreators';
import { ContextModule, getContext } from '~context';
import {
  CreateDomainMetadataDocument,
  CreateDomainMetadataMutation,
  CreateDomainMetadataMutationVariables,
  GetFullColonyByNameDocument,
} from '~gql';
import { getDomainDatabaseId } from '~utils/domains';
import { toNumber } from '~utils/numbers';

import {
  createGroupTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import { putError, takeFrom } from '../utils';

function* createDomainAction({
  payload: {
    colony,
    domainName,
    domainColor,
    domainPurpose,
    annotationMessage,
    parentId = Id.RootDomain,
  },
  meta: { id: metaId, navigate },
  meta,
}: Action<ActionTypes.ACTION_DOMAIN_CREATE>) {
  let txChannel;
  try {
    const apolloClient = getContext(ContextModule.ApolloClient);

    /*
     * Validate the required values
     */
    if (!domainName) {
      throw new Error('A domain name is required to create a new domain');
    }

    txChannel = yield call(getTxChannel, metaId);

    const batchKey = 'createDomainAction';
    const {
      createDomainAction: createDomain,
      annotateCreateDomainAction: annotateCreateDomain,
    } = yield createTransactionChannels(metaId, [
      'createDomainAction',
      // 'annotateCreateDomainAction',
    ]);

    yield createGroupTransaction(createDomain, batchKey, meta, {
      context: ClientType.ColonyClient,
      methodName: 'addDomainWithProofs(uint256)',
      identifier: colony.colonyAddress,
      params: [],
      ready: false,
    });

    // if (annotationMessage) {
    //   yield createGroupTransaction(annotateCreateDomain, {
    //     context: ClientType.ColonyClient,
    //     methodName: 'annotateTransaction',
    //     identifier: colonyAddress,
    //     params: [],
    //     ready: false,
    //   });
    // }

    yield takeFrom(createDomain.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateCreateDomain.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionPending(createDomain.id));
    yield put(transactionAddParams(createDomain.id, [parentId]));
    yield put(transactionReady(createDomain.id));

    const {
      payload: {
        receipt: { transactionHash },
        eventData,
      },
    } = yield takeFrom(createDomain.channel, ActionTypes.TRANSACTION_SUCCEEDED);
    const { domainId } = eventData?.DomainAdded || {};
    const nativeDomainId = toNumber(domainId);

    /**
     * Save domain metadata in the database
     */
    yield apolloClient.mutate<
      CreateDomainMetadataMutation,
      CreateDomainMetadataMutationVariables
    >({
      mutation: CreateDomainMetadataDocument,
      variables: {
        input: {
          id: getDomainDatabaseId(colony.colonyAddress, nativeDomainId),
          name: domainName,
          color: domainColor,
          description: domainPurpose,
        },
      },
      refetchQueries: [GetFullColonyByNameDocument],
    });

    // if (annotationMessage) {
    //   yield put(transactionPending(annotateCreateDomain.id));

    //   /*
    //    * Upload domain metadata to IPFS
    //    */
    //   const annotationMessageIpfsHash = yield call(
    //     uploadIfpsAnnotation,
    //     annotationMessage,
    //   );

    //   yield put(
    //     transactionAddParams(annotateCreateDomain.id, [
    //       txHash,
    //       annotationMessageIpfsHash,
    //     ]),
    //   );

    //   yield put(transactionReady(annotateCreateDomain.id));

    //   yield takeFrom(
    //     annotateCreateDomain.channel,
    //     ActionTypes.TRANSACTION_SUCCEEDED,
    //   );
    // }

    /*
     * Update the colony object cache
     */
    // yield apolloClient.query<ColonyFromNameQuery, ColonyFromNameQueryVariables>(
    //   {
    //     query: ColonyFromNameDocument,
    //     variables: { name: colonyName || '', address: colonyAddress },
    //     fetchPolicy: 'network-only',
    //   },
    // );

    yield put<AllActions>({
      type: ActionTypes.ACTION_DOMAIN_CREATE_SUCCESS,
      meta,
    });

    if (navigate) {
      navigate(`/colony/${colony.name}/tx/${transactionHash}`);
    }
  } catch (error) {
    return yield putError(ActionTypes.ACTION_DOMAIN_CREATE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* createDomainActionSaga() {
  yield takeEvery(ActionTypes.ACTION_DOMAIN_CREATE, createDomainAction);
}
