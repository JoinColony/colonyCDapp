import { type GetStreamingPaymentsByColonyQuery } from '~gql';

export type StreamingPaymentItems = NonNullable<
  NonNullable<GetStreamingPaymentsByColonyQuery['getStreamingPaymentsByColony']>
>['items'];
