import { type TransactionReceipt } from '@ethersproject/providers';

import { TransactionStatus } from '~gql';
import { type TransactionSucceededPayload } from '~redux/types/actions/transaction.ts';
import {
  type MethodParams,
  type TxConfig,
  TransactionErrors,
} from '~types/transactions.ts';

import { ActionTypes } from '../actionTypes.ts';
import {
  type GasPricesProps,
  type TransactionError,
} from '../immutable/index.ts';
import { type AllActions } from '../types/actions/index.ts';

export const createTransactionAction = (
  id: string,
  from: string,
  {
    context,
    group,
    identifier,
    methodContext,
    methodName,
    options,
    params = [],
    ready,
    metatransaction = false,
    title,
    titleValues,
  }: TxConfig,
) => ({
  type: ActionTypes.TRANSACTION_CREATED,
  payload: {
    context,
    createdAt: new Date(),
    from,
    group,
    identifier,
    methodContext,
    methodName,
    options,
    params,
    status:
      ready === false ? TransactionStatus.Created : TransactionStatus.Ready,
    metatransaction,
    title,
    titleValues,
  },
  meta: { id },
});

const transactionError = (
  type: TransactionError['type'],
  id: string,
  error: Error,
): AllActions => ({
  type: ActionTypes.TRANSACTION_ERROR,
  payload: {
    error: {
      type,
      message: error.message || error.toString(),
    },
  },
  error: true,
  meta: { id },
});

export const transactionEstimateError = transactionError.bind(
  null,
  TransactionErrors.Estimate,
);

export const transactionEventDataError = transactionError.bind(
  null,
  TransactionErrors.EventData,
);

export const transactionReceiptError = transactionError.bind(
  null,
  TransactionErrors.Receipt,
);

export const transactionSendError = transactionError.bind(
  null,
  TransactionErrors.Send,
);

export const transactionUnsuccessfulError = transactionError.bind(
  null,
  TransactionErrors.Unsuccessful,
);

export const transactionReceiptReceived = (
  id: string,
  payload: { receipt: TransactionReceipt; params: MethodParams },
): AllActions => ({
  type: ActionTypes.TRANSACTION_RECEIPT_RECEIVED,
  payload,
  meta: { id },
});

export const transactionSent = (id: string): AllActions => ({
  type: ActionTypes.TRANSACTION_SENT,
  meta: { id },
});

export const transactionHashReceived = (
  id: string,
  payload: {
    hash: string;
    blockHash: string;
    blockNumber: number;
    params: MethodParams;
  },
): AllActions => ({
  type: ActionTypes.TRANSACTION_HASH_RECEIVED,
  payload,
  meta: { id },
});

export const transactionSucceeded = (
  id: string,
  payload: TransactionSucceededPayload,
  metatransaction = false,
): AllActions => ({
  type: ActionTypes.TRANSACTION_SUCCEEDED,
  payload,
  meta: { id, metatransaction },
});

export const transactionPending = (id: string): AllActions => ({
  type: ActionTypes.TRANSACTION_PENDING,
  meta: { id },
});

export const transactionEstimateGas = (id: string): AllActions => ({
  type: ActionTypes.TRANSACTION_ESTIMATE_GAS,
  meta: { id },
});

export const transactionUpdateGas = (
  id: string,
  data: { gasLimit?: string; gasPrice?: string },
): AllActions => ({
  type: ActionTypes.TRANSACTION_GAS_UPDATE,
  payload: data,
  meta: { id },
});

export const transactionLoadRelated = (
  id: string,
  loading: boolean,
): AllActions => ({
  type: ActionTypes.TRANSACTION_LOAD_RELATED,
  payload: { loading },
  meta: { id },
});

export const transactionCancel = (id: string): AllActions => ({
  type: ActionTypes.TRANSACTION_CANCEL,
  meta: { id },
});

export const updateGasPrices = (gasPrices: GasPricesProps): AllActions => ({
  type: ActionTypes.GAS_PRICES_UPDATE,
  payload: gasPrices,
});

export const transactionSend = (id: string): AllActions => ({
  type: ActionTypes.TRANSACTION_SEND,
  meta: { id },
});

export const transactionUpdateOptions = (
  id: string,
  data: { options?: TxConfig['options'] },
): AllActions => ({
  type: ActionTypes.TRANSACTION_OPTIONS_UPDATE,
  payload: data,
  meta: { id },
});
