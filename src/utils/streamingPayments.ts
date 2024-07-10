import { BigNumber } from 'ethers';

import { StreamingPaymentEndCondition } from '~gql';
import { type StreamingPayment } from '~types/graphql.ts';

export const getStreamingPaymentLimit = ({
  streamingPayment,
}: {
  streamingPayment: StreamingPayment;
}): string | undefined => {
  const { token, amount, startTime, endTime, interval, metadata } =
    streamingPayment;

  const tokenDecimals = token?.decimals;

  if (
    !tokenDecimals ||
    metadata?.endCondition !== StreamingPaymentEndCondition.LimitReached
  ) {
    return '0';
  }

  const originalAmount = BigNumber.from(amount).div(
    BigNumber.from(10).pow(tokenDecimals),
  );

  const limit = BigNumber.from(endTime)
    .sub(startTime)
    .mul(originalAmount)
    .div(interval);
  return limit.toString();
};
