import { type StreamingPaymentEndCondition } from '~gql';
import { type StreamingPayment } from '~types/graphql.ts';
import { type StreamingPaymentStatus } from '~types/streamingPayments.ts';

import { type UserStreamsItem } from './partials/UserStreams/UserStreams.ts';

export interface StreamingPaymentItem {
  [user: string]: {
    tokenTotalsPerMonth: {
      [token: string]: UserStreamsItem;
    };
    actions: StreamingActionTableFieldModel[];
  };
}

export interface StreamingTableFieldModel {
  user: string;
  tokenTotalsPerMonth: {
    [token: string]: UserStreamsItem;
  };
  actions: StreamingActionTableFieldModel[];
}

export interface StreamingActionTableFieldModel extends StreamingPayment {
  title: string;
  paymentId: string;
  transactionId: string;
  status: StreamingPaymentStatus;
  endCondition?: StreamingPaymentEndCondition;
  totalStreamedAmount: string;
}
