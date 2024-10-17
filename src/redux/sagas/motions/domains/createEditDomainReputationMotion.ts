import {
  ClientType,
  Id,
  getPermissionProofs,
  getChildIndex,
  ColonyRole,
} from '@colony/colony-js';
import { AddressZero } from '@ethersproject/constants';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { ContextModule, getContext } from '~context/index.ts';
import { ActionTypes } from '~redux/actionTypes.ts';
import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
  waitForTxResult,
} from '~redux/sagas/transactions/index.ts';
import {
  putError,
  takeFrom,
  // uploadIfpsAnnotation,
  getColonyManager,
  uploadAnnotation,
  initiateTransaction,
} from '~redux/sagas/utils/index.ts';
import { type AllActions, type Action } from '~redux/types/actions/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

import { handleDomainMetadata } from './utils/handleDomainMetadata.ts';

// import { ipfsUpload } from '../ipfs';

function* createEditDomainReputationMotion({
  payload: {
    colonyAddress,
    domainName,
    domainColor,
    domainPurpose,
    annotationMessage,
    domain,
    isCreateDomain,
    parentDomainId = Id.RootDomain,
    domainCreatedInNativeId,
    customActionTitle,
  },
  meta: { id: metaId, setTxHash },
  meta,
}: Action<ActionTypes.MOTION_REPUTATION_DOMAIN_CREATE_EDIT>) {
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
      !isCreateDomain && domain?.nativeId ? domain.nativeId : parentDomainId;

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
      domainCreatedInNativeId,
      domainId,
    );

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      domainCreatedInNativeId,
    );

    const { key, value, branchMask, siblings } = yield call(
      colonyClient.getReputation,
      skillId,
      AddressZero,
    );

    // setup batch ids and channels
    const batchKey = TRANSACTION_METHODS.CreateMotion;

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
        domainCreatedInNativeId,
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

    yield initiateTransaction(createMotion.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(createMotion.channel);

    yield handleDomainMetadata({
      apolloClient,
      colonyAddress,
      domainName,
      isCreateDomain,
      txHash,
      domain,
      domainColor,
      domainPurpose,
      customActionTitle,
    });

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateMotion,
        message: annotationMessage,
        txHash,
      });
    }

    setTxHash?.(txHash);

    yield put<AllActions>({
      type: ActionTypes.MOTION_REPUTATION_DOMAIN_CREATE_EDIT_SUCCESS,
      meta,
    });
  } catch (caughtError) {
    yield putError(
      ActionTypes.MOTION_REPUTATION_DOMAIN_CREATE_EDIT_ERROR,
      caughtError,
      meta,
    );
  } finally {
    txChannel.close();
  }
}

export default function* createEditDomainReputationMotionSaga() {
  yield takeEvery(
    ActionTypes.MOTION_REPUTATION_DOMAIN_CREATE_EDIT,
    createEditDomainReputationMotion,
  );
}
