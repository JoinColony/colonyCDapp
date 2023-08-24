import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import { ClientType, ColonyRole } from '@colony/colony-js';

import { ActionTypes, Action, AllActions } from '~redux';
import { ColonyManager } from '~context';

import {
  putError,
  takeFrom,
  uploadAnnotation,
  getColonyManager,
  getMultiPermissionProofs,
} from '../utils';

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

function* createPaymentAction({
  payload: {
    colonyAddress,
    colonyName,
    recipientAddress,
    domainId,
    singlePayment,
    annotationMessage,
  },
  meta: { id: metaId, navigate },
  meta,
}: Action<ActionTypes.ACTION_EXPENDITURE_PAYMENT>) {
  yield Math.min();
  let txChannel;
  try {
    const colonyManager: ColonyManager = yield getColonyManager();

    /*
     * Validate the required values for the payment
     */
    if (!recipientAddress) {
      throw new Error('Recipient not assigned for OneTxPayment transaction');
    }
    if (!domainId) {
      throw new Error('Domain not set for OneTxPayment transaction');
    }
    if (!singlePayment) {
      throw new Error('Payment details not set for OneTxPayment transaction');
    } else {
      if (!singlePayment.amount) {
        throw new Error('Payment amount not set for OneTxPayment transaction');
      }
      if (!singlePayment.tokenAddress) {
        throw new Error('Payment token not set for OneTxPayment transaction');
      }
      if (!singlePayment.decimals) {
        throw new Error(
          'Payment token decimals not set for OneTxPayment transaction',
        );
      }
    }
    const { amount, tokenAddress, decimals = 18 } = singlePayment;
    txChannel = yield call(getTxChannel, metaId);
    /*
     * setup batch ids and channels
     */
    const batchKey = 'paymentAction';
    const { paymentAction, annotatePaymentAction } =
      yield createTransactionChannels(metaId, [
        'paymentAction',
        'annotatePaymentAction',
      ]);

    yield fork(createTransaction, paymentAction.id, {
      context: ClientType.OneTxPaymentClient,
      methodName: 'makePaymentFundedFromDomain',
      identifier: colonyAddress,
      params: [],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotatePaymentAction.id, {
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

    yield takeFrom(paymentAction.channel, ActionTypes.TRANSACTION_CREATED);

    if (annotationMessage) {
      yield takeFrom(
        annotatePaymentAction.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionPending(paymentAction.id));

    const oneTxPaymentClient = yield colonyManager.getClient(
      ClientType.OneTxPaymentClient,
      colonyAddress,
    );

    const [extensionPDID, extensionCSI] = yield getMultiPermissionProofs(
      colonyAddress,
      domainId,
      [ColonyRole.Funding, ColonyRole.Administration],
      oneTxPaymentClient.address,
    );
    const [userPDID, userCSI] = yield getMultiPermissionProofs(
      colonyAddress,
      domainId,
      [ColonyRole.Funding, ColonyRole.Administration],
    );

    yield put(
      transactionAddParams(paymentAction.id, [
        extensionPDID,
        extensionCSI,
        userPDID,
        userCSI,
        [recipientAddress],
        [tokenAddress],
        [BigNumber.from(moveDecimal(amount, decimals))],
        domainId,
        /*
         * NOTE Always make the payment in the global skill 0
         * This will make it so that the user only receives reputation in the
         * above domain, but none in the skill itself.
         */
        0,
      ]),
    );

    yield put(transactionReady(paymentAction.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      paymentAction.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );
    yield takeFrom(paymentAction.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotatePaymentAction,
        message: annotationMessage,
        txHash,
      });
    }

    yield put<AllActions>({
      type: ActionTypes.ACTION_EXPENDITURE_PAYMENT_SUCCESS,
      meta,
    });

    if (colonyName) {
      navigate(`/colony/${colonyName}/tx/${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (error) {
    putError(ActionTypes.ACTION_EXPENDITURE_PAYMENT_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

export default function* paymentActionSaga() {
  yield takeEvery(ActionTypes.ACTION_EXPENDITURE_PAYMENT, createPaymentAction);
}
