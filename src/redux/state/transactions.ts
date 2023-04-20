import { Record, Map as ImmutableMap } from 'immutable';

import { DefaultValues, RecordToJS } from '~types';

import { TransactionRecord, TransactionId, TransactionType } from '../immutable';
import { CORE_TRANSACTIONS_LIST } from '../constants';

type TransactionsListObject = { [transactionId: string]: TransactionType };

export type TransactionsListMap = ImmutableMap<TransactionId, TransactionRecord> & { toJS(): TransactionsListObject };

export interface CoreTransactionsProps {
  list: TransactionsListMap;
}

const defaultValues: DefaultValues<CoreTransactionsProps> = {
  [CORE_TRANSACTIONS_LIST]: ImmutableMap() as TransactionsListMap,
};

export class CoreTransactionsRecord
  extends Record<CoreTransactionsProps>(defaultValues)
  implements RecordToJS<{ list: TransactionsListObject }> {}

export const CoreTransactions = (p?: CoreTransactionsProps) => new CoreTransactionsRecord(p);
