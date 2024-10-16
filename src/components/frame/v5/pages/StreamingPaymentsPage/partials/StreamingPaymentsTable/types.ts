import { type StreamingPayment } from '~types/graphql.ts';

import { type UserStreamsItem } from './partials/UserStreams/UserStreams.ts';

export interface StreamingTableFieldModel {
  user: string;
  userStreams: UserStreamsItem[];
  actions: StreamingActionTableFieldModel[];
}

export interface StreamingActionTableFieldModel
  extends Pick<
    StreamingPayment,
    | 'token'
    | 'nativeDomainId'
    | 'creatorAddress'
    | 'recipientAddress'
    | 'amount'
    | 'interval'
  > {
  title: string;
  paymentId: string;
  transactionId: string;
}
