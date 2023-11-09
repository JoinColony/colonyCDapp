import { call, fork, put, takeEvery } from 'redux-saga/effects';
import {
  ClientType,
  Id,
  getPermissionProofs,
  getChildIndex,
  ColonyRole,
} from '@colony/colony-js';
import { AddressZero } from '@ethersproject/constants';

import { ContextModule, getContext } from '~context';
import {
  CreateDomainMetadataDocument,
  CreateDomainMetadataMutation,
  CreateDomainMetadataMutationVariables,
  DomainColor,
} from '~gql';
import { getPendingMetadataDatabaseId } from '~utils/databaseId';

import { ActionTypes } from '../../actionTypes';
import { AllActions, Action } from '../../types/actions';
import {
  putError,
  takeFrom,
  // uploadIfpsAnnotation,
  getColonyManager,
  getUpdatedDomainMetadataChangelog,
  uploadAnnotation,
  initiateTransaction,
  createActionMetadataInDB,
} from '../utils';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
// import { ipfsUpload } from '../ipfs';

function* createEditDomainMotion({
  payload: {
    colonyAddress,
    colonyName,
    domainName,
    domainColor,
    domainPurpose,
    annotationMessage,
    domain,
    isCreateDomain,
    parentId = Id.RootDomain,
    motionDomainId,
    customActionTitle,
  },
  meta: { id: metaId, navigate, setTxHash },
  meta,
}: Action<ActionTypes.MOTION_DOMAIN_CREATE_EDIT>) {
  let txChannel;
  try {
    const apolloClient = getContext(ContextModule.ApolloClient);

    /*
     * Validate the required values
     */
    if (!domainName) {
      throw new Error('A domain name is required to create a new domain');
    }

    if (!isCreateDomain && !domain?.id) {
      throw new Error('A domain id is required to edit domain');
    }

    txChannel = yield call(getTxChannel, metaId);

    /* additional editDomain check is for the TS to not ring alarm in getPermissionProofs */
    const domainId =
      !isCreateDomain && domain?.nativeId ? domain.nativeId : parentId;

    const context = yield getColonyManager();
    const colonyClient = yield context.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );
    const votingReputationClient = yield context.getClient(
      ClientType.VotingReputationClient,
      colonyAddress,
    );

    const [permissionDomainId, childSkillIndex] = yield call(
      getPermissionProofs,
      colonyClient.networkClient,
      colonyClient,
      domainId,
      ColonyRole.Architecture,
      votingReputationClient.address,
    );

    const motionChildSkillIndex = yield call(
      getChildIndex,
      colonyClient.networkClient,
      colonyClient,
      motionDomainId,
      domainId,
    );

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      motionDomainId,
    );

    const { key, value, branchMask, siblings } = yield call(
      colonyClient.getReputation,
      skillId,
      AddressZero,
    );

    // setup batch ids and channels
    const batchKey = 'createMotion';

    const { createMotion, annotateMotion } = yield createTransactionChannels(
      metaId,
      ['createMotion', 'annotateMotion'],
    );

    /*
     * Upload domain metadata to IPFS
     */
    // let domainMetadataIpfsHash = null;
    // domainMetadataIpfsHash = yield call(
    //   ipfsUpload,
    //   JSON.stringify({
    //     domainName,
    //     domainColor,
    //     domainPurpose,
    //   }),
    // );

    const encodedAction = colonyClient.interface.encodeFunctionData(
      isCreateDomain
        ? 'addDomain(uint256,uint256,uint256,string)'
        : 'editDomain',
      [permissionDomainId, childSkillIndex, domainId, '.'], // domainMetadataIpfsHash
    );

    // create transactions
    yield fork(createTransaction, createMotion.id, {
      context: ClientType.VotingReputationClient,
      methodName: 'createMotion',
      identifier: colonyAddress,
      params: [
        motionDomainId,
        motionChildSkillIndex,
        AddressZero,
        encodedAction,
        key,
        value,
        branchMask,
        siblings,
      ],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateMotion.id, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        group: {
          key: batchKey,
          id: metaId,
          index: 1,
        },
        ready: false,
      });
    }

    yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(annotateMotion.channel, ActionTypes.TRANSACTION_CREATED);
    }

    yield initiateTransaction({ id: createMotion.id });

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      createMotion.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    setTxHash?.(txHash);

    yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (isCreateDomain) {
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
            id: getPendingMetadataDatabaseId(colonyAddress, txHash),
            name: domainName,
            color: domainColor || DomainColor.LightPink,
            description: domainPurpose || '',
          },
        },
      });
    } else if (domain?.metadata) {
      yield apolloClient.mutate<
        CreateDomainMetadataMutation,
        CreateDomainMetadataMutationVariables
      >({
        mutation: CreateDomainMetadataDocument,
        variables: {
          input: {
            id: getPendingMetadataDatabaseId(colonyAddress, txHash),
            name: domainName,
            color: domainColor || domain.metadata.color,
            description: domainPurpose || domain.metadata.description,
            changelog: getUpdatedDomainMetadataChangelog(
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

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateMotion,
        message: annotationMessage,
        txHash,
      });
    }

    yield put<AllActions>({
      type: ActionTypes.MOTION_DOMAIN_CREATE_EDIT_SUCCESS,
      meta,
    });

    if (colonyName && navigate) {
      navigate(`/colony/${colonyName}/tx/${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (caughtError) {
    putError(ActionTypes.MOTION_DOMAIN_CREATE_EDIT_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* createEditDomainMotionSaga() {
  yield takeEvery(
    ActionTypes.MOTION_DOMAIN_CREATE_EDIT,
    createEditDomainMotion,
  );
}
