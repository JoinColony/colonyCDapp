import { Record } from 'immutable';

import { TransactionStatus } from '~gql';
import { type DefaultValues, type RecordToJS } from '~types/index.ts';

interface Shared {
  id: string;
  createdAt?: Date;

  /*
   * Why is the message signature required, so we can attach a message
   * descriptor id to it and show a prettier name
   */
  purpose?: string;
  message: string;
  signature?: string;
  status?: TransactionStatus;
}

export type MessageType = Readonly<Shared>;

const defaultValues: DefaultValues<Shared> = {
  id: undefined,
  createdAt: new Date(),
  purpose: 'generic',
  message: undefined,
  signature: undefined,
  status: TransactionStatus.Created,
};

export class MessageRecord
  extends Record<Shared>(defaultValues)
  implements RecordToJS<MessageType> {}

export const Message = (p: Shared) => new MessageRecord(p);
