import { ClientType, ColonyRole } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { type ColonyManager } from '~context/index.ts';
import { ActionTypes, type Action, type AllActions } from '~redux/index.ts';
import { type OneTxPaymentPayload } from '~redux/types/actions/colonyActions.ts';
import {
  transactionSetParams,
  transactionSetPending,
} from '~state/transactionState.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

import {
  createTransaction,
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
  getMultiPermissionProofs,
  createActionMetadataInDB,
  adjustPayoutsAddresses,
} from '../utils/index.ts';

function* createPaymentAction({
  payload: {
    colonyAddress,
    domainId,
    payments,
    annotationMessage,
    customActionTitle,
  },
  meta: { id: metaId, setTxHash },
  meta,
}: Action<ActionTypes.ACTION_EXPENDITURE_PAYMENT>) {
  let txChannel;
  try {
    const colonyManager: ColonyManager = yield getColonyManager();
    const { network } = colonyManager.networkClient;
    /*
     * Validate the required values for the payment
     */

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
    /*
     * setup batch ids and channels
     */
    const batchKey = TRANSACTION_METHODS.Payment;

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

    yield transactionSetPending(paymentAction.id);

    const oneTxPaymentClient = yield colonyManager.getClient(
      ClientType.OneTxPaymentClient,
      colonyAddress,
    );

    const [extensionPDID, extensionCSI] = yield getMultiPermissionProofs({
      colonyAddress,
      domainId,
      roles: [ColonyRole.Funding, ColonyRole.Administration],
      customAddress: oneTxPaymentClient.address,
    });
    const [userPDID, userCSI] = yield getMultiPermissionProofs({
      colonyAddress,
      domainId,
      roles: [ColonyRole.Funding, ColonyRole.Administration],
    });

    yield transactionSetParams(paymentAction.id, [
      extensionPDID,
      extensionCSI,
      userPDID,
      userCSI,
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
    ]);

    yield initiateTransaction(paymentAction.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(paymentAction.channel);

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotatePaymentAction,
        message: annotationMessage,
        txHash,
      });
    }

    setTxHash?.(txHash);

    yield put<AllActions>({
      type: ActionTypes.ACTION_EXPENDITURE_PAYMENT_SUCCESS,
      meta,
    });
  } catch (error) {
    yield putError(ActionTypes.ACTION_EXPENDITURE_PAYMENT_ERROR, error, meta);
  } finally {
    txChannel?.close();
  }
}

export default function* paymentActionSaga() {
  yield takeEvery(ActionTypes.ACTION_EXPENDITURE_PAYMENT, createPaymentAction);
}

function sortPayments(
  { recipientAddress: recipientA, tokenAddress: tokenA },
  { recipientAddress: recipientB, tokenAddress: tokenB },
) {
  if (recipientA < recipientB) {
    return -1;
  }
  if (recipientA > recipientB) {
    return 1;
  }

  // If the recipients are the same, sort by token address

  if (tokenA < tokenB) {
    return -1;
  }

  if (tokenA > tokenB) {
    return 1;
  }

  return 0;
}

// This returns the format expected by the contracts:
// recipients in "ascending" order (per string sorting convention)
// and tokens in ascending order where recipients are the same.
// We also combine duplicate user / token combos, if they exist.

export function sortAndCombinePayments(
  payments: OneTxPaymentPayload['payments'],
): {
  recipientAddress: string;
  amount: BigNumber;
  tokenAddress: string;
}[] {
  return payments.sort(sortPayments).reduce(
    (acc, payment) => {
      const { recipientAddress, tokenAddress, amount } = payment;
      const convertedAmount = BigNumber.from(amount);

      const {
        recipientAddress: prevRecipient,
        tokenAddress: prevToken,
        amount: prevAmount,
      } = acc.at(-1) ?? {};

      const updatedAcc = [...acc, { ...payment, amount: convertedAmount }];

      if (recipientAddress !== prevRecipient || tokenAddress !== prevToken) {
        return updatedAcc;
      }

      acc.pop(); // remove previous payment

      return [
        ...acc,
        {
          ...payment,
          // prev amount is only not defined if idx is 0, in which case recipient !== prevRecipient

          amount: convertedAmount.add(prevAmount!),
        },
      ];
    },
    [] as {
      recipientAddress: string;
      amount: BigNumber;
      tokenAddress: string;
      decimals: number;
    }[],
  );
}
