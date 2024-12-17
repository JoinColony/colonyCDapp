import {
  ClientType,
  Id,
  getPermissionProofs,
  ColonyRole,
} from '@colony/colony-js';
import { call, put, takeEvery } from 'redux-saga/effects';

import { mutateWithAuthRetry } from '~apollo/utils.ts';
import {
  ContextModule,
  getContext,
  type ColonyManager,
} from '~context/index.ts';
import {
  CreateDomainMetadataDocument,
  type CreateDomainMetadataMutation,
  type CreateDomainMetadataMutationVariables,
} from '~gql';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import {
  transactionSetParams,
  transactionSetPending,
} from '~state/transactionState.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';
import { getDomainDatabaseId } from '~utils/databaseId.ts';
import { toNumber } from '~utils/numbers.ts';

import {
  createGroupTransaction,
  createTransactionChannels,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
  getColonyManager,
  createActionMetadataInDB,
} from '../utils/index.ts';

function* createDomainAction({
  payload: {
    colonyAddress,
    domainName,
    domainColor,
    domainPurpose,
    annotationMessage,
    parentId = Id.RootDomain,
    customActionTitle,
  },
  meta: { id: metaId, setTxHash },
  meta,
}: Action<ActionTypes.ACTION_DOMAIN_CREATE>) {
  let txChannel;
  try {
    const apolloClient = getContext(ContextModule.ApolloClient);
    const colonyManager: ColonyManager = yield getColonyManager();

    /*
     * Validate the required values
     */
    if (!domainName) {
      throw new Error('A domain name is required to create a new domain');
    }

    txChannel = yield call(getTxChannel, metaId);

    const batchKey = TRANSACTION_METHODS.CreateDomain;

    const {
      createDomainAction: createDomain,
      annotateCreateDomainAction: annotateCreateDomain,
    } = yield createTransactionChannels(metaId, [
      'createDomainAction',
      'annotateCreateDomainAction',
    ]);

    yield createGroupTransaction({
      channel: createDomain,
      batchKey,
      meta,
      config: {
        context: ClientType.ColonyClient,
        methodName: 'addDomain(uint256,uint256,uint256)',
        identifier: colonyAddress,
        params: [],
        ready: false,
      },
    });

    if (annotationMessage) {
      yield createGroupTransaction({
        channel: annotateCreateDomain,
        batchKey,
        meta,
        config: {
          context: ClientType.ColonyClient,
          methodName: 'annotateTransaction',
          identifier: colonyAddress,
          params: [],
          ready: false,
        },
      });
    }

    yield takeFrom(createDomain.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateCreateDomain.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield transactionSetPending(createDomain.id);

    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
      colonyClient.networkClient,
      colonyClient,
      parentId,
      ColonyRole.Architecture,
    );

    yield transactionSetParams(createDomain.id, [
      permissionDomainId,
      childSkillIndex,
      parentId,
    ]);

    yield initiateTransaction(createDomain.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
        eventData,
      },
    } = yield waitForTxResult(createDomain.channel);

    const { domainId } = eventData?.DomainAdded || {};
    const nativeDomainId = toNumber(domainId);

    yield createActionMetadataInDB(txHash, { customTitle: customActionTitle });

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateCreateDomain,
        message: annotationMessage,
        txHash,
      });
    }

    /**
     * Save domain metadata in the database
     */
    yield mutateWithAuthRetry(() =>
      apolloClient.mutate<
        CreateDomainMetadataMutation,
        CreateDomainMetadataMutationVariables
      >({
        mutation: CreateDomainMetadataDocument,
        variables: {
          input: {
            id: getDomainDatabaseId(colonyAddress, nativeDomainId),
            name: domainName,
            color: domainColor,
            description: domainPurpose,
          },
        },
      }),
    );

    setTxHash?.(txHash);

    yield put<AllActions>({
      type: ActionTypes.ACTION_DOMAIN_CREATE_SUCCESS,
      meta,
    });
  } catch (error) {
    yield putError(ActionTypes.ACTION_DOMAIN_CREATE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

export default function* createDomainActionSaga() {
  yield takeEvery(ActionTypes.ACTION_DOMAIN_CREATE, createDomainAction);
}
