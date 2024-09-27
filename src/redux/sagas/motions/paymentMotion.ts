import {
  type AnyVotingReputationClient,
  ClientType,
  ColonyRole,
  Id,
} from '@colony/colony-js';
import { AddressZero } from '@ethersproject/constants';
import { BigNumber } from 'ethers';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { ActionTypes } from '~redux/actionTypes.ts';
import { type AllActions, type Action } from '~redux/types/actions/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

import { sortAndCombinePayments } from '../actions/payment.ts';
import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  putError,
  takeFrom,
  getColonyManager,
  uploadAnnotation,
  initiateTransaction,
  createActionMetadataInDB,
  adjustPayoutsAddresses,
  getPermissionProofsLocal,
  getChildIndexLocal,
} from '../utils/index.ts';

function* createPaymentMotion({
  payload: {
    colonyAddress,
    domainId,
    payments,
    annotationMessage,
    motionDomainId,
    customActionTitle,
    colonyRoles,
    colonyDomains,
    isMultiSig = false,
  },
  meta: { id: metaId, setTxHash },
  meta,
}: Action<ActionTypes.MOTION_EXPENDITURE_PAYMENT>) {
  let txChannel;
  try {
    /*
     * Validate the required values for the payment
     */

    if (!motionDomainId) {
      throw new Error('Motion domain id not set for OneTxPayment transaction');
    }

    if (!domainId) {
      throw new Error('Domain not set for OneTxPayment transaction');
    }
    if (!payments || !payments.length) {
      throw new Error('Payment details not set for OneTxPayment transaction');
    } else {
      if (!payments.every(({ amount }) => !!amount)) {
        throw new Error('Payment amount not set for OneTxPayment transaction');
      }
      if (!payments.every(({ tokenAddress }) => !!tokenAddress)) {
        throw new Error('Payment token not set for OneTxPayment transaction');
      }
      if (!payments.every(({ recipientAddress }) => !!recipientAddress)) {
        throw new Error('Recipient not assigned for OneTxPayment transaction');
      }
    }

    const colonyManager = yield getColonyManager();
    const oneTxPaymentClient = yield colonyManager.getClient(
      ClientType.OneTxPaymentClient,
      colonyAddress,
    );

    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const { network } = colonyManager.networkClient;

    const payouts = yield adjustPayoutsAddresses(payments, network);
    const sortedCombinedPayments = sortAndCombinePayments(payouts);

    const tokenAddresses = sortedCombinedPayments.map(
      ({ tokenAddress }) => tokenAddress,
    );

    const amounts = sortedCombinedPayments.map(({ amount }) => amount);

    const recipientAddresses = sortedCombinedPayments.map(
      ({ recipientAddress }) => recipientAddress,
    );

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = TRANSACTION_METHODS.CreateMotion;

    const { createMotion, annotatePaymentMotion } =
      yield createTransactionChannels(metaId, [
        'createMotion',
        'annotatePaymentMotion',
      ]);

    // eslint-disable-next-line no-inner-declarations
    function* getPaymentMotionParams() {
      const requiredRoles = [
        ColonyRole.Funding,
        ColonyRole.Administration,
        ColonyRole.Arbitration,
      ];
      const safeMotionId = motionDomainId || Id.RootDomain;

      const rootDomain = colonyDomains.find((domain) =>
        BigNumber.from(domain.nativeId).eq(Id.RootDomain),
      );
      const motionDomain = colonyDomains.find((domain) =>
        BigNumber.from(domain.nativeId).eq(safeMotionId),
      );
      const paymentDomain = colonyDomains.find((domain) =>
        BigNumber.from(domain.nativeId).eq(domainId),
      );

      if (!rootDomain || !motionDomain || !paymentDomain) {
        throw new Error(
          'Cannot find rootDomain, motion domain or payment from domain in colony domains',
        );
      }

      const userAddress = yield colonyClient.signer.getAddress();

      const [extensionPDID, extensionCSI] = yield call(
        getPermissionProofsLocal,
        {
          networkClient: colonyClient.networkClient,
          colonyRoles,
          colonyDomains,
          requiredDomainId: domainId,
          requiredColonyRoles: requiredRoles,
          permissionAddress: oneTxPaymentClient.address,
          isMultiSig: false,
        },
      );

      if (isMultiSig) {
        const multiSigClient = yield colonyManager.getClient(
          ClientType.MultisigPermissionsClient,
          colonyAddress,
        );

        const [userPermissionDomainId, userChildSkillIndex] = yield call(
          getPermissionProofsLocal,
          {
            networkClient: colonyClient.networkClient,
            colonyRoles,
            colonyDomains,
            requiredDomainId: domainId,
            requiredColonyRoles: requiredRoles,
            permissionAddress: userAddress,
            isMultiSig,
          },
        );

        const [multiSigPDID, multiSigCSI] = yield call(
          getPermissionProofsLocal,
          {
            networkClient: colonyClient.networkClient,
            colonyRoles,
            colonyDomains,
            requiredDomainId: domainId,
            requiredColonyRoles: requiredRoles,
            permissionAddress: multiSigClient.address,
            isMultiSig: false,
          },
        );
        const encodedAction = oneTxPaymentClient.interface.encodeFunctionData(
          'makePaymentFundedFromDomain',
          [
            extensionPDID,
            extensionCSI,
            multiSigPDID,
            multiSigCSI,
            recipientAddresses,
            tokenAddresses,
            amounts,
            domainId,
            /*
             * NOTE Always make the payment in the global skill 0
             * This will make it so that the user only receives reputation in the
             * above domain, but none in the skill itself.
             */
            0,
          ],
        );

        return {
          context: ClientType.MultisigPermissionsClient,
          methodName: 'createMotion',
          identifier: colonyAddress,
          params: [
            userPermissionDomainId,
            userChildSkillIndex,
            [oneTxPaymentClient.address],
            [encodedAction],
          ],
          group: {
            key: batchKey,
            id: metaId,
            index: 0,
          },
          ready: false,
        };
      }

      const votingReputationClient: AnyVotingReputationClient =
        yield colonyManager.getClient(
          ClientType.VotingReputationClient,
          colonyAddress,
        );

      const childSkillIndex = yield call(getChildIndexLocal, {
        networkClient: colonyClient.networkClient,
        parentDomainNativeId: motionDomain.nativeId,
        parentDomainSkillId: motionDomain.nativeSkillId,
        domainNativeId: paymentDomain.nativeId,
        domainSkillId: paymentDomain.nativeSkillId,
      });

      const [votingReputationPDID, votingReputationCSI] = yield call(
        getPermissionProofsLocal,
        {
          networkClient: colonyClient.networkClient,
          colonyRoles,
          colonyDomains,
          requiredDomainId: domainId,
          requiredColonyRoles: requiredRoles,
          permissionAddress: votingReputationClient.address,
          isMultiSig: false,
        },
      );

      const encodedAction = oneTxPaymentClient.interface.encodeFunctionData(
        'makePaymentFundedFromDomain',
        [
          extensionPDID,
          extensionCSI,
          votingReputationPDID,
          votingReputationCSI,
          recipientAddresses,
          tokenAddresses,
          amounts,
          domainId,
          /*
           * NOTE Always make the payment in the global skill 0
           * This will make it so that the user only receives reputation in the
           * above domain, but none in the skill itself.
           */
          0,
        ],
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
      return {
        context: ClientType.VotingReputationClient,
        methodName: 'createMotion',
        identifier: colonyAddress,
        params: [
          motionDomainId,
          childSkillIndex,
          oneTxPaymentClient.address,
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
      };
    }

    const transactionParams = yield getPaymentMotionParams();
    // create transactions
    yield fork(createTransaction, createMotion.id, transactionParams);

    if (annotationMessage) {
      yield fork(createTransaction, annotatePaymentMotion.id, {
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
      yield takeFrom(
        annotatePaymentMotion.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield initiateTransaction(createMotion.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(createMotion.channel);

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotatePaymentMotion,
        message: annotationMessage,
        txHash,
      });
    }

    setTxHash?.(txHash);

    yield put<AllActions>({
      type: ActionTypes.MOTION_EXPENDITURE_PAYMENT_SUCCESS,
      meta,
    });
  } catch (caughtError) {
    yield putError(
      ActionTypes.MOTION_EXPENDITURE_PAYMENT_ERROR,
      caughtError,
      meta,
    );
  } finally {
    txChannel?.close();
  }
}

export default function* paymentMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_EXPENDITURE_PAYMENT, createPaymentMotion);
}
