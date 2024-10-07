import { ClientType, Id } from '@colony/colony-js';
import { AddressZero } from '@ethersproject/constants';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { PERMISSIONS_NEEDED_FOR_ACTION } from '~constants/actions.ts';
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
  getPermissionProofsLocal,
} from '~redux/sagas/utils/index.ts';
import { type AllActions, type Action } from '~redux/types/actions/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

import { handleDomainMetadata } from './utils/handleDomainMetadata.ts';

// import { ipfsUpload } from '../ipfs';

function* createEditDomainMultiSigMotion({
  payload: {
    colonyAddress,
    domainName,
    domainColor,
    domainPurpose,
    annotationMessage,
    domain,
    isCreateDomain,
    parentDomainId = Id.RootDomain,
    customActionTitle,
    colonyDomains,
    colonyRoles,
  },
  meta: { id: metaId, setTxHash },
  meta,
}: Action<ActionTypes.MOTION_MULTISIG_DOMAIN_CREATE_EDIT>) {
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
    const domainNativeId =
      !isCreateDomain && domain?.nativeId ? domain.nativeId : parentDomainId;

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

    const colonyManager = yield getColonyManager();

    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const requiredRoles = isCreateDomain
      ? PERMISSIONS_NEEDED_FOR_ACTION.CreateNewTeam
      : PERMISSIONS_NEEDED_FOR_ACTION.EditExistingTeam;

    const userAddress = yield colonyClient.signer.getAddress();

    const [permissionDomainId, childSkillIndex] = yield call(
      getPermissionProofsLocal,
      {
        networkClient: colonyClient.networkClient,
        colonyRoles,
        colonyDomains,
        requiredDomainId: domainNativeId,
        requiredColonyRoles: requiredRoles,
        permissionAddress: userAddress,
        isMultiSig: true,
      },
    );

    const encodedAction = colonyClient.interface.encodeFunctionData(
      isCreateDomain
        ? 'addDomain(uint256,uint256,uint256,string)'
        : 'editDomain',
      [permissionDomainId, childSkillIndex, domainNativeId, '.'], // domainMetadataIpfsHash
    );

    const transactionParams = {
      context: ClientType.MultisigPermissionsClient,
      methodName: TRANSACTION_METHODS.CreateMotion,
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      params: [
        permissionDomainId,
        childSkillIndex,
        [AddressZero],
        [encodedAction],
      ],
      ready: false,
    };

    yield fork(createTransaction, createMotion.id, transactionParams);

    yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_CREATED);

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
      type: ActionTypes.MOTION_MULTISIG_DOMAIN_CREATE_EDIT_SUCCESS,
      meta,
    });
  } catch (caughtError) {
    yield putError(
      ActionTypes.MOTION_MULTISIG_DOMAIN_CREATE_EDIT_ERROR,
      caughtError,
      meta,
    );
  } finally {
    txChannel.close();
  }
}

export default function* createEditDomainMultiSigMotionSaga() {
  yield takeEvery(
    ActionTypes.MOTION_MULTISIG_DOMAIN_CREATE_EDIT,
    createEditDomainMultiSigMotion,
  );
}
