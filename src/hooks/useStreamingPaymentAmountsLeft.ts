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

  const {
    startTime: startTimeString,
    endTime: endTimeString,
    amount,
    interval,
  } = streamingPayment;

  const startTime = BigNumber.from(startTimeString);
  const endTime = BigNumber.from(endTimeString);

  if (startTime.gte(currentTimestamp)) {
    amountAvailableToClaim = BigNumber.from(0);
  } else {
    const durationToClaim = endTime.lt(currentTimestamp)
      ? endTime.sub(startTime) // End time has already passed, the whole duration can be claimed.
      : BigNumber.from(currentTimestamp).sub(startTime); // End time has not passed, calculate duration to be claimed.

    const amountAvailableSinceStart = BigNumber.from(amount)
      .mul(durationToClaim)
      .div(interval);

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
