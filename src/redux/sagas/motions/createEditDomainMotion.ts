import {
  ClientType,
  Id,
  getPermissionProofs,
  ColonyRole,
  type ColonyClientV15,
} from '@colony/colony-js';
import { AddressZero } from '@ethersproject/constants';
import { BigNumber } from 'ethers';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { ContextModule, getContext } from '~context/index.ts';
import {
  CreateDomainMetadataDocument,
  type CreateDomainMetadataMutation,
  type CreateDomainMetadataMutationVariables,
  DomainColor,
  type ColonyRoleFragment,
} from '~gql';
import { type Address } from '~types';
import { type Domain } from '~types/graphql.ts';
import { type MethodParams, TRANSACTION_METHODS } from '~types/transactions.ts';
import { getPendingMetadataDatabaseId } from '~utils/databaseId.ts';

import { ActionTypes } from '../../actionTypes.ts';
import {
  type AllActions,
  type Action,
  type RootMotionMethodNames,
} from '../../types/actions/index.ts';
import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  putError,
  takeFrom,
  // uploadIfpsAnnotation,
  getColonyManager,
  getUpdatedDomainMetadataChangelog,
  uploadAnnotation,
  initiateTransaction,
  createActionMetadataInDB,
  getPermissionProofsLocal,
  getChildIndexLocal,
} from '../utils/index.ts';

import { REQUIRED_MULTISIG_ROLES_BY_OPERATION } from './constants.ts';

// import { ipfsUpload } from '../ipfs';

type TransactionPayloadBase = {
  isMultiSig: boolean;
  colonyAddress: Address;
  encodedAction: string;
  batchKey: string;
  metaId: string;
  index: number;
  colonyDomains: Domain[];
  colonyClient: ColonyClientV15;
};

type MultiSigPaTransactionPayload = {
  colonyRoles: ColonyRoleFragment[];
  operationName: RootMotionMethodNames;
};

type MotionTransactionPayload = {
  motionDomainId: number;
};

// type TransactionPayload =
//   | MultiSigPaTransactionPayload
//   | MotionTransactionPayload;

type TransactionPayload = {
  base: TransactionPayloadBase;
  multiSigPayload: MultiSigPaTransactionPayload;
  motionPayload: MotionTransactionPayload;
};

function* getCreateTransactionPayload(payload: TransactionPayload) {
  const {
    base: {
      isMultiSig,
      colonyAddress,
      encodedAction,
      batchKey,
      metaId,
      index,
      colonyDomains,
      colonyClient,
    },
  } = payload;

  const transactionParams = {
    context: isMultiSig
      ? ClientType.MultisigPermissionsClient
      : ClientType.VotingReputationClient,
    methodName: 'createMotion',
    identifier: colonyAddress,
    group: {
      key: batchKey,
      id: metaId,
      index,
    },
    params: [] as MethodParams,
    ready: false,
  };

  if (isMultiSig) {
    const { operationName, colonyRoles } = payload.multiSigPayload;

    const requiredRoles = REQUIRED_MULTISIG_ROLES_BY_OPERATION[operationName];

    const userAddress = yield colonyClient.signer.getAddress();

    const [, childSkillIndex] = yield call(getPermissionProofsLocal, {
      networkClient: colonyClient.networkClient,
      colonyRoles,
      colonyDomains,
      requiredDomainId: Id.RootDomain,
      requiredColonyRole: requiredRoles,
      permissionAddress: userAddress,
      isMultiSig,
    });

    transactionParams.params = [
      Id.RootDomain,
      childSkillIndex,
      [AddressZero],
      [encodedAction],
    ];
  } else {
    const rootDomain = colonyDomains.find((domain) =>
      BigNumber.from(domain.nativeId).eq(Id.RootDomain),
    );

    if (!rootDomain) {
      throw new Error('Cannot find rootDomain in colony domains');
    }

    const { motionDomainId } = payload.motionPayload;

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      motionDomainId,
    );

    // this is only for the reputation flow
    const {
      key: reputationKey,
      value: reputationValue,
      branchMask: reputationBranchMask,
      siblings: reputationSiblings,
    } = yield call(colonyClient.getReputation, skillId, AddressZero);

    const motionChildSkillIndex = yield call(getChildIndexLocal, {
      networkClient: colonyClient.networkClient,
      parentDomainNativeId: rootDomain.nativeId,
      parentDomainSkillId: rootDomain.nativeSkillId,
      domainNativeId: rootDomain.nativeId,
      domainSkillId: rootDomain.nativeSkillId,
    });

    transactionParams.params = [
      motionDomainId,
      motionChildSkillIndex,
      AddressZero,
      encodedAction,
      reputationKey,
      reputationValue,
      reputationBranchMask,
      reputationSiblings,
    ];
  }

  return transactionParams;
}

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
    isMultiSig,
    colonyDomains,
    colonyRoles,
    operationName,
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

    const colonyManager = yield getColonyManager();
    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );
    const votingReputationClient = yield colonyManager.getClient(
      ClientType.VotingReputationClient,
      colonyAddress,
    );

    const [permissionDomainId, childSkillIndex] = yield call(
      getPermissionProofs,
      colonyClient.networkClient,
      colonyClient,
      isMultiSig ? Id.RootDomain : domainId,
      ColonyRole.Architecture,
      votingReputationClient.address,
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

    const transactionParams = yield call(getCreateTransactionPayload, {
      base: {
        batchKey,
        colonyAddress,
        encodedAction,
        index: 0,
        isMultiSig,
        metaId,
        colonyDomains,
        colonyClient,
      },
      motionPayload: {
        motionDomainId,
      },
      multiSigPayload: {
        colonyRoles,
        operationName,
      },
    });

    // create transactions everything is same after this
    yield fork(createTransaction, createMotion.id, transactionParams);

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
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(createMotion.channel);

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
            changelog: getUpdatedDomainMetadataChangelog({
              transactionHash: txHash,
              metadata: domain.metadata,
              newName: domainName,
              newColor: domainColor,
              newDescription: domainPurpose,
            }),
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

    setTxHash?.(txHash);

    yield put<AllActions>({
      type: ActionTypes.MOTION_DOMAIN_CREATE_EDIT_SUCCESS,
      meta,
    });

    if (colonyName && navigate) {
      navigate(`/${colonyName}?tx=${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (caughtError) {
    yield putError(
      ActionTypes.MOTION_DOMAIN_CREATE_EDIT_ERROR,
      caughtError,
      meta,
    );
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
