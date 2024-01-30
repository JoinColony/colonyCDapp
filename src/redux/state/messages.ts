import { Record, Map as ImmutableMap } from 'immutable';

import { type DefaultValues, type RecordToJS } from '~types/index.ts';

import { CORE_MESSAGES_LIST } from '../constants.ts';
import {
  type MessageRecord,
  type MessageType,
  type TransactionId,
} from '../immutable/index.ts';

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
