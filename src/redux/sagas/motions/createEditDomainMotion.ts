import { ClientType, Id } from '@colony/colony-js';
import { AddressZero } from '@ethersproject/constants';
import { BigNumber } from 'ethers';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { PERMISSIONS_NEEDED_FOR_ACTION } from '~constants/actions.ts';
import { ContextModule, getContext } from '~context/index.ts';
import {
  CreateDomainMetadataDocument,
  type CreateDomainMetadataMutation,
  type CreateDomainMetadataMutationVariables,
  DomainColor,
} from '~gql';
import { type MethodParams, TRANSACTION_METHODS } from '~types/transactions.ts';
import { getPendingMetadataDatabaseId } from '~utils/databaseId.ts';

import { ActionTypes } from '../../actionTypes.ts';
import { type AllActions, type Action } from '../../types/actions/index.ts';
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

// import { ipfsUpload } from '../ipfs';

type CreateTransactionPayload = Pick<
  Action<ActionTypes.MOTION_DOMAIN_CREATE_EDIT>['payload'],
  | 'isMultiSig'
  | 'isCreateDomain'
  | 'colonyAddress'
  | 'colonyDomains'
  | 'colonyRoles'
  | 'domain'
  | 'domainCreatedInNativeId'
> & {
  batchKey: string;
  metaId: string;
  index: number;
  domainNativeId: number;
  action: string;
};

function* getCreateTransactionPayload({
  isMultiSig,
  colonyAddress,
  batchKey,
  metaId,
  index,
  colonyDomains,
  isCreateDomain,
  domainNativeId,
  action,
  colonyRoles,
  domain,
  domainCreatedInNativeId,
}: CreateTransactionPayload) {
  const transactionParams = {
    context: isMultiSig
      ? ClientType.MultisigPermissionsClient
      : ClientType.VotingReputationClient,
    methodName: TRANSACTION_METHODS.CreateMotion,
    identifier: colonyAddress,
    group: {
      key: batchKey,
      id: metaId,
      index,
    },
    params: [] as MethodParams,
    ready: false,
  };

  const colonyManager = yield getColonyManager();

  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  const requiredRoles = isCreateDomain
    ? PERMISSIONS_NEEDED_FOR_ACTION.CreateNewTeam
    : PERMISSIONS_NEEDED_FOR_ACTION.EditExistingTeam;

  const userAddress = yield colonyClient.signer.getAddress();

  if (isMultiSig) {
    const [permissionDomainId, childSkillIndex] = yield call(
      getPermissionProofsLocal,
      {
        networkClient: colonyClient.networkClient,
        colonyRoles,
        colonyDomains,
        requiredDomainId: domainCreatedInNativeId, // This will be dynamically set by the user via the 'Created in' form field
        requiredColonyRole: requiredRoles,
        permissionAddress: userAddress,
        isMultiSig,
      },
    );

    const encodedAction = colonyClient.interface.encodeFunctionData(
      action,
      [permissionDomainId, childSkillIndex, domainNativeId, '.'], // domainMetadataIpfsHash
    );

    transactionParams.params = [
      permissionDomainId,
      childSkillIndex,
      [isCreateDomain ? colonyAddress : AddressZero],
      [encodedAction],
    ];
  } else {
    const rootDomain = colonyDomains.find((colonyDomain) =>
      BigNumber.from(colonyDomain.nativeId).eq(domainNativeId),
    );

    if (!rootDomain) {
      throw new Error('Cannot find rootDomain in colony domains');
    }

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      domainCreatedInNativeId,
    );

    const {
      key: reputationKey,
      value: reputationValue,
      branchMask: reputationBranchMask,
      siblings: reputationSiblings,
    } = yield call(colonyClient.getReputation, skillId, AddressZero);

    const domainSkillId = isCreateDomain
      ? rootDomain.nativeSkillId
      : domain?.nativeSkillId;

    if (!domainSkillId) {
      throw new Error('A Skill ID was not found for the selected domain');
    }

    const motionChildSkillIndex = yield call(getChildIndexLocal, {
      networkClient: colonyClient.networkClient,
      parentDomainNativeId: rootDomain.nativeId,
      parentDomainSkillId: rootDomain.nativeSkillId,
      domainNativeId: isCreateDomain ? rootDomain.nativeId : domainNativeId,
      domainSkillId,
    });

    const votingReputationClient = yield colonyManager.getClient(
      ClientType.VotingReputationClient,
      colonyAddress,
    );

    const [permissionDomainId, childSkillIndex] = yield call(
      getPermissionProofsLocal,
      {
        networkClient: colonyClient.networkClient,
        colonyRoles,
        colonyDomains,
        requiredDomainId: domainCreatedInNativeId,
        requiredColonyRole: requiredRoles,
        permissionAddress: votingReputationClient.address,
        isMultiSig,
      },
    );

    const encodedAction = colonyClient.interface.encodeFunctionData(action, [
      permissionDomainId,
      childSkillIndex,
      domainNativeId,
      '.',
    ]);

    transactionParams.params = [
      domainCreatedInNativeId,
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
    parentDomainId = Id.RootDomain,
    customActionTitle,
    isMultiSig,
    colonyDomains,
    colonyRoles,
    domainCreatedInNativeId,
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

    const transactionParams = yield call(getCreateTransactionPayload, {
      batchKey,
      colonyAddress,
      index: 0,
      isMultiSig,
      metaId,
      colonyDomains,
      isCreateDomain,
      domainNativeId,
      colonyRoles,
      action: isCreateDomain
        ? 'addDomain(uint256,uint256,uint256,string)'
        : 'editDomain',
      domain,
      domainCreatedInNativeId,
    });

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
