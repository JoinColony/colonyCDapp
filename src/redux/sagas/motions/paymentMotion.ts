import { call, fork, put, takeEvery } from 'redux-saga/effects';
import {
  ClientType,
  getChildIndex,
  getPermissionProofs,
  ColonyRole,
} from '@colony/colony-js';
import { AddressZero } from '@ethersproject/constants';

import { ActionTypes } from '../../actionTypes';
import { AllActions, Action } from '../../types/actions';
import {
  putError,
  takeFrom,
  getColonyManager,
  uploadAnnotation,
  initiateTransaction,
  createActionMetadataInDB,
} from '../utils';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import { sortAndCombinePayments } from '../actions/payment';

function* createPaymentMotion({
  payload: {
    colonyAddress,
    colonyName,
    domainId,
    payments,
    annotationMessage,
    motionDomainId,
    customActionTitle,
  },
  meta: { id: metaId, navigate, setTxHash },
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
      if (!payments.every(({ decimals }) => !!decimals)) {
        throw new Error(
          'Payment token decimals not set for OneTxPayment transaction',
        );
      }
      if (!payments.every(({ recipient }) => !!recipient)) {
        throw new Error('Recipient not assigned for OneTxPayment transaction');
      }
    }

    const colonyManager = yield getColonyManager();
    const oneTxPaymentClient = yield colonyManager.getClient(
      ClientType.OneTxPaymentClient,
      colonyAddress,
    );

    const votingReputationClient = yield colonyManager.getClient(
      ClientType.VotingReputationClient,
      colonyAddress,
    );

    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const childSkillIndex = yield call(
      getChildIndex,
      colonyClient.networkClient,
      colonyClient,
      motionDomainId,
      domainId,
    );

    const [extensionPDID, extensionCSI] = yield call(
      getPermissionProofs,
      colonyClient.networkClient,
      colonyClient,
      domainId,
      [ColonyRole.Funding, ColonyRole.Administration],
      oneTxPaymentClient.address,
    );

    const [votingReputationPDID, votingReputationCSI] = yield call(
      getPermissionProofs,
      colonyClient.networkClient,
      colonyClient,
      domainId,
      [ColonyRole.Funding, ColonyRole.Administration],
      votingReputationClient.address,
    );

    const sortedCombinedPayments = sortAndCombinePayments(payments);

    const tokenAddresses = sortedCombinedPayments.map(
      ({ tokenAddress }) => tokenAddress,
    );

    const amounts = sortedCombinedPayments.map(({ amount }) => amount);

    const recipientAddresses = sortedCombinedPayments.map(
      ({ recipient }) => recipient,
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

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = 'createMotion';

    const { createMotion, annotatePaymentMotion } =
      yield createTransactionChannels(metaId, [
        'createMotion',
        'annotatePaymentMotion',
      ]);

    // create transactions
    yield fork(createTransaction, createMotion.id, {
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
    });

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

    yield initiateTransaction({ id: createMotion.id });

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      createMotion.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    setTxHash?.(txHash);

    yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotatePaymentMotion,
        message: annotationMessage,
        txHash,
      });
    }
    yield put<AllActions>({
      type: ActionTypes.MOTION_EXPENDITURE_PAYMENT_SUCCESS,
      meta,
    });

    if (navigate && colonyName) {
      navigate(`/colony/${colonyName}/tx/${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (caughtError) {
    putError(ActionTypes.MOTION_EXPENDITURE_PAYMENT_ERROR, caughtError, meta);
  } finally {
    txChannel?.close();
  }
}

export default function* paymentMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_EXPENDITURE_PAYMENT, createPaymentMotion);
}
