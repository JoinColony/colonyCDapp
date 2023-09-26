import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import { ClientType } from '@colony/colony-js';

import { ActionTypes, Action, AllActions } from '~redux';

import {
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
} from '../utils';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import { OneTxPaymentPayload } from '~redux/types/actions/colonyActions';

function* createPaymentAction({
  payload: { colonyAddress, colonyName, domainId, payments, annotationMessage },
  meta: { id: metaId, navigate },
  meta,
}: Action<ActionTypes.ACTION_EXPENDITURE_PAYMENT>) {
  let txChannel;
  try {
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
      if (!payments.every(({ decimals }) => !!decimals)) {
        throw new Error(
          'Payment token decimals not set for OneTxPayment transaction',
        );
      }
      if (!payments.every(({ recipient }) => !!recipient)) {
        throw new Error('Recipient not assigned for OneTxPayment transaction');
      }
    }

    const sortedCombinedPayments = sortAndCombinePayments(payments);

    const tokenAddresses = sortedCombinedPayments.map(
      ({ tokenAddress }) => tokenAddress,
    );

    const amounts = sortedCombinedPayments.map(({ amount }) => amount);

    const recipientAddresses = sortedCombinedPayments.map(
      ({ recipient }) => recipient,
    );

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
      methodName: 'makePaymentFundedFromDomainWithProofs',
      identifier: colonyAddress,
      params: [
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

    yield initiateTransaction({ id: paymentAction.id });

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
    txChannel?.close();
  }
}

export default function* paymentActionSaga() {
  yield takeEvery(ActionTypes.ACTION_EXPENDITURE_PAYMENT, createPaymentAction);
}

function sortPayments(
  { recipient: recipientA, tokenAddress: tokenA },
  { recipient: recipientB, tokenAddress: tokenB },
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
  recipient: string;
  amount: BigNumber;
  tokenAddress: string;
  decimals: number;
}[] {
  return payments.sort(sortPayments).reduce(
    (acc, payment) => {
      const { recipient, tokenAddress, amount, decimals } = payment;
      const convertedAmount = BigNumber.from(moveDecimal(amount, decimals));

      const {
        recipient: prevRecipient,
        tokenAddress: prevToken,
        amount: prevAmount,
      } = acc.at(-1) ?? {};

      const updatedAcc = [...acc, { ...payment, amount: convertedAmount }];

      if (recipient !== prevRecipient || tokenAddress !== prevToken) {
        return updatedAcc;
      }

      acc.pop(); // remove previous payment

      return [
        ...acc,
        {
          ...payment,
          // prev amount is only not defined if idx is 0, in which case recipient !== prevRecipient
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          amount: convertedAmount.add(prevAmount!),
        },
      ];
    },
    [] as {
      recipient: string;
      amount: BigNumber;
      tokenAddress: string;
      decimals: number;
    }[],
  );
}
