import { ClientType, ColonyRole } from '@colony/colony-js';
import { type CustomContract } from '@colony/sdk';
import { BigNumber, utils } from 'ethers';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { oneTxPaymentAbi } from '~constants/abis.ts';
import {
  ContextModule,
  getContext,
  type ColonyManager,
} from '~context/index.ts';
import {
  transactionHashReceived,
  transactionReceiptReceived,
  transactionSent,
  transactionSucceeded,
} from '~redux/actionCreators/transactions.ts';
import { ActionTypes, type Action, type AllActions } from '~redux/index.ts';
import { type OneTxPaymentPayload } from '~redux/types/actions/colonyActions.ts';
import { addTransactionToDb } from '~state/transactionState.ts';
import { TransactionStatus } from '~types/graphql.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions/index.ts';
import {
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
    chainId,
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

    txChannel = yield call(getTxChannel, metaId);

    const oneTxPaymentClient = yield colonyManager.getClient(
      ClientType.OneTxPaymentClient,
      colonyAddress,
    );

    const oneTxPaymentContract: CustomContract<typeof oneTxPaymentAbi> =
      colonyManager.getCustomContract(
        oneTxPaymentClient.address,
        oneTxPaymentAbi,
      );

    const { address } = getContext(ContextModule.Wallet);

    const walletAddress = utils.getAddress(address);

    const payouts = yield adjustPayoutsAddresses(payments, network);
    const sortedCombinedPayments = sortAndCombinePayments(payouts);

    const tokenAddresses = sortedCombinedPayments.map(
      ({ tokenAddress }) => tokenAddress,
    );

    // we don't use multiple payments, but let's add the chainId for each payment just in case
    const chainIds = sortedCombinedPayments.map(() => chainId);

    const amounts = sortedCombinedPayments.map(({ amount }) => amount);

    const recipientAddresses = sortedCombinedPayments.map(
      ({ recipientAddress }) => recipientAddress,
    );

    txChannel = yield call(getTxChannel, metaId);
    /*
     * setup batch ids and channels
     */
    const batchKey = TRANSACTION_METHODS.Payment;

    const { annotatePaymentAction } = yield createTransactionChannels(metaId, [
      'annotatePaymentAction',
    ]);

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

    // @TODO type these
    const params = [
      extensionPDID,
      extensionCSI,
      userPDID,
      userCSI,
      recipientAddresses,
      chainIds,
      tokenAddresses,
      amounts,
      domainId,
      /*
       * NOTE Always make the payment in the global skill 0
       * This will make it so that the user only receives reputation in the
       * above domain, but none in the skill itself.
       */
      0,
    ];

    yield addTransactionToDb(metaId, {
      context: ClientType.ColonyClient, // @NOTE we want to add a new context type
      createdAt: new Date(),
      methodName: 'makePaymentFundedFromDomain',
      from: walletAddress,
      params,
      status: TransactionStatus.Ready,
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
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

    const [transaction, waitForMined] = yield oneTxPaymentContract
      .createTxCreator(
        'makePaymentFundedFromDomain(uint256,uint256,uint256,uint256,address[],uint256[],address[],uint256[],uint256,uint256)' as any,
        // we ignore that because the params break due to the signature being untyped:waitForMined
        // @ts-ignore
        params,
      )
      .tx()
      .send({
        gasLimit: BigInt(10_000_000),
      });

    put(transactionSent(metaId));

    if (!transaction || !transaction.blockHash || !transaction.blockNumber) {
      throw new Error('Invalid transaction'); // @TODO add more info
    }

    put(
      transactionHashReceived(metaId, {
        hash: transaction.hash,
        blockNumber: transaction.blockNumber,
        blockHash: transaction.blockHash,
        params,
      }),
    );

    const [eventData, receipt] = yield waitForMined();

    put(transactionReceiptReceived(metaId, { params, receipt }));
    put(transactionSucceeded(metaId, { eventData, receipt, params }));

    if (annotationMessage) {
      yield takeFrom(
        annotatePaymentAction.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield createActionMetadataInDB(transaction.hash, {
      customTitle: customActionTitle,
    });

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotatePaymentAction,
        message: annotationMessage,
        txHash: transaction.hash,
      });
    }

    setTxHash?.(transaction.hash);

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
