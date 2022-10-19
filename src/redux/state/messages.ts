import { Record, Map as ImmutableMap } from 'immutable';

import { DefaultValues, RecordToJS } from '~types';

import { MessageRecord, MessageType, TransactionId } from '../immutable';
import { CORE_MESSAGES_LIST } from '../constants';

type MessagesListObject = { [transactionId: string]: MessageType };

export type MessagesListMap = ImmutableMap<TransactionId, MessageRecord> & {
  toJS(): MessagesListObject;
};

export interface CoreMessagesProps {
  [CORE_MESSAGES_LIST]: MessagesListMap;
}

const defaultValues: DefaultValues<CoreMessagesProps> = {
  [CORE_MESSAGES_LIST]: ImmutableMap() as MessagesListMap,
};

export class CoreMessagesRecord
  extends Record<CoreMessagesProps>(defaultValues)
  implements RecordToJS<{ [CORE_MESSAGES_LIST]: MessagesListObject }> {}

export const CoreMessages = (p?: CoreMessagesProps) =>
  new CoreMessagesRecord(p);
