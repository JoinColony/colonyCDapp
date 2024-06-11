import { BigNumber } from 'ethers';

import { type StreamingPayment } from '~types/graphql.ts';

interface UseStreamingPaymentAmountsLeftReturn {
  amountClaimedToDate: string;
  amountAvailableToClaim: string;
}

const useStreamingPaymentAmountsLeft = (
  streamingPayment: StreamingPayment | null | undefined,
  currentTimestamp: number,
): UseStreamingPaymentAmountsLeftReturn => {
  if (!streamingPayment || !streamingPayment.amount) {
    return {
      amountClaimedToDate: '0',
      amountAvailableToClaim: '0',
    };
  }

  const amountClaimedToDate =
    streamingPayment.claims?.reduce((sum, claim) => {
      const newAmount = BigNumber.from(claim.amount).add(sum);

      return newAmount.toString();
    }, '0') ?? '0';

  let amountAvailableToClaim: BigNumber;
  if (streamingPayment.startTime >= currentTimestamp) {
    amountAvailableToClaim = BigNumber.from(0);
  } else {
    const durationToClaim =
      Math.min(currentTimestamp, streamingPayment.endTime) -
      streamingPayment.startTime;

    const amountAvailableSinceStart = BigNumber.from(streamingPayment.amount)
      .mul(BigNumber.from(durationToClaim))
      .div(streamingPayment.interval);

    amountAvailableToClaim = amountAvailableSinceStart.sub(amountClaimedToDate);

    amountAvailableToClaim = amountAvailableToClaim.lt(0)
      ? BigNumber.from(0)
      : amountAvailableToClaim;
  }

  return {
    amountClaimedToDate,
    amountAvailableToClaim: amountAvailableToClaim.toString(),
  };
};

export default useStreamingPaymentAmountsLeft;
