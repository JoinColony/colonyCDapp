import { Record, Map as ImmutableMap } from 'immutable';

import { type DefaultValues, type RecordToJS } from '~types/index.ts';

import { CORE_TRANSACTIONS_LIST } from '../constants.ts';
import {
  type TransactionRecord,
  type TransactionId,
  type TransactionType,
} from '../immutable/index.ts';

type TransactionsListObject = { [transactionId: string]: TransactionType };

export type TransactionsListMap = ImmutableMap<
  TransactionId,
  TransactionRecord
> & { toJS(): TransactionsListObject };

export interface CoreTransactionsProps {
  list: TransactionsListMap;
}

const defaultValues: DefaultValues<CoreTransactionsProps> = {
  [CORE_TRANSACTIONS_LIST]: ImmutableMap() as TransactionsListMap,
};

export class CoreTransactionsRecord
  extends Record<CoreTransactionsProps>(defaultValues)
  implements RecordToJS<{ list: TransactionsListObject }> {}

export const CoreTransactions = (p?: CoreTransactionsProps) =>
  new CoreTransactionsRecord(p);
