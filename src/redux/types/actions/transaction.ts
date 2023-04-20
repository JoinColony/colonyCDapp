import { TransactionReceipt } from '@ethersproject/providers';

import { TransactionError, TransactionType } from '~redux/immutable';
import { MethodParams } from '~types';

import { ActionTypes } from '../../actionTypes';
import { ActionTypeWithMeta, ActionTypeWithPayloadAndMeta } from '../../types/actions';

type Meta = { id: string; metatransaction?: boolean };

export type TransactionActionTypes =
  | ActionTypeWithPayloadAndMeta<ActionTypes.TRANSACTION_ADD_IDENTIFIER, { identifier: string }, Meta>
  | ActionTypeWithPayloadAndMeta<ActionTypes.TRANSACTION_ADD_PARAMS, { params: MethodParams }, Meta>
  | ActionTypeWithMeta<ActionTypes.TRANSACTION_READY, Meta>
  | ActionTypeWithMeta<ActionTypes.TRANSACTION_PENDING, Meta>
  | ActionTypeWithMeta<ActionTypes.TRANSACTION_CANCEL, Meta>
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.TRANSACTION_CREATED,
      Pick<
        TransactionType,
        | 'context'
        | 'createdAt'
        | 'from'
        | 'group'
        | 'identifier'
        | 'methodContext'
        | 'methodName'
        | 'options'
        | 'params'
        | 'gasPrice'
        | 'gasLimit'
        | 'status'
        | 'metatransaction'
        | 'title'
        | 'titleValues'
      >,
      Meta
    >
  | (ActionTypeWithPayloadAndMeta<ActionTypes.TRANSACTION_ERROR, { error: TransactionError }, { id: string }> & {
      error: true;
    })
  | ActionTypeWithMeta<ActionTypes.TRANSACTION_ESTIMATE_GAS, Meta>
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.TRANSACTION_HASH_RECEIVED,
      { hash: string; blockHash: string; blockNumber: number; params: object },
      Meta
    >
  | ActionTypeWithPayloadAndMeta<ActionTypes.TRANSACTION_GAS_UPDATE, { gasLimit?: string; gasPrice?: string }, Meta>
  | ActionTypeWithPayloadAndMeta<ActionTypes.TRANSACTION_LOAD_RELATED, { loading: boolean }, Meta>
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.TRANSACTION_RECEIPT_RECEIVED,
      { receipt: TransactionReceipt; params: MethodParams },
      Meta
    >
  | ActionTypeWithMeta<ActionTypes.TRANSACTION_SEND, Meta>
  | ActionTypeWithMeta<ActionTypes.TRANSACTION_SENT, Meta>
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.TRANSACTION_SUCCEEDED,
      {
        eventData: object;
        params: MethodParams;
        receipt: TransactionReceipt;
        deployedContractAddress?: string;
      },
      Meta
    >
  | ActionTypeWithMeta<ActionTypes.TRANSACTION_RETRY, Meta>;
