import { BigNumber } from 'ethers';

import { StreamingPaymentEndCondition } from '~gql';
import { type StreamingPayment } from '~types/graphql.ts';

export const getStreamingPaymentLimit = ({
  streamingPayment,
}: {
  streamingPayment: StreamingPayment;
}): string | undefined => {
  const {
    amount: amountInWei,
    startTime,
    endTime,
    interval,
    metadata,
  } = streamingPayment;

  if (metadata?.endCondition !== StreamingPaymentEndCondition.LimitReached) {
    return '0';
  }

  const limitInWei = BigNumber.from(endTime)
    .sub(startTime)
    .mul(amountInWei)
    .div(interval);

  return limitInWei.toString();
};
