import { TransactionReceipt } from '@ethersproject/providers';

import { TransactionError, TransactionType } from '~redux/immutable/index.ts';
import { MethodParams } from '~types/transactions.ts';

import { ActionTypes } from '../../actionTypes.ts';

import { ActionTypeWithMeta, ActionTypeWithPayloadAndMeta } from './index.ts';

export type Meta = { id: string; metatransaction?: boolean };

export type TransactionCreatedPayload = Pick<
  TransactionType,
  | 'context'
  | 'createdAt'
  | 'from'
  | 'group'
  | 'identifier'
  | 'methodContext'
  | 'methodName'
  | 'metatransaction'
  | 'options'
  | 'params'
  | 'status'
  | 'gasPrice'
  | 'gasLimit'
  | 'title'
  | 'titleValues'
>;

export type CreateTransactionActionType = ActionTypeWithPayloadAndMeta<
  ActionTypes.TRANSACTION_CREATED,
  TransactionCreatedPayload,
  Meta
>;

export type TransactionGasUpdatePayload = {
  gasLimit?: string;
  gasPrice?: string;
};
export type TransactionErrorPayload = { error: TransactionError };
export type TransactionAddIdentifierPayload = { identifier: string };
export type TransactionAddParamsPayload = { params: MethodParams };
export type TransactionLoadRelatedPayload = { loading: boolean };
export type TransactionHashReceivedPayload = {
  hash: string;
  blockHash: string;
  blockNumber: number;
  params: object;
};
export type TransactionReceiptReceivedPayload = {
  receipt: TransactionReceipt;
  params: MethodParams;
};
export type TransactionSucceededPayload = {
  eventData: object;
  params: MethodParams;
  receipt: TransactionReceipt;
  deployedContractAddress?: string;
};

export type TransactionActionTypes =
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.TRANSACTION_ADD_IDENTIFIER,
      TransactionAddIdentifierPayload,
      Meta
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.TRANSACTION_ADD_PARAMS,
      TransactionAddParamsPayload,
      Meta
    >
  | ActionTypeWithMeta<ActionTypes.TRANSACTION_READY, Meta>
  | ActionTypeWithMeta<ActionTypes.TRANSACTION_PENDING, Meta>
  | ActionTypeWithMeta<ActionTypes.TRANSACTION_CANCEL, Meta>
  | CreateTransactionActionType
  | (ActionTypeWithPayloadAndMeta<
      ActionTypes.TRANSACTION_ERROR,
      TransactionErrorPayload,
      Meta
    > & {
      error: true;
    })
  | ActionTypeWithMeta<ActionTypes.TRANSACTION_ESTIMATE_GAS, Meta>
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.TRANSACTION_HASH_RECEIVED,
      TransactionHashReceivedPayload,
      Meta
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.TRANSACTION_GAS_UPDATE,
      TransactionGasUpdatePayload,
      Meta
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.TRANSACTION_LOAD_RELATED,
      TransactionLoadRelatedPayload,
      Meta
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.TRANSACTION_RECEIPT_RECEIVED,
      TransactionReceiptReceivedPayload,
      Meta
    >
  | ActionTypeWithMeta<ActionTypes.TRANSACTION_SEND, Meta>
  | ActionTypeWithMeta<ActionTypes.TRANSACTION_SENT, Meta>
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.TRANSACTION_SUCCEEDED,
      TransactionSucceededPayload,
      Meta
    >
  | ActionTypeWithMeta<ActionTypes.TRANSACTION_RETRY, Meta>;
