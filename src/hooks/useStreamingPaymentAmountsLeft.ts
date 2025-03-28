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
      return BigNumber.from(claim.amount).add(sum);
    }, BigNumber.from(0)) ?? BigNumber.from(0);

  let amountAvailableToClaim = BigNumber.from(0);

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

    // Convert to WAD arithmetic to match Solidity implementation
    const WAD = BigNumber.from(10).pow(18);
    const intervalsToClaim = durationToClaim.mul(WAD).div(interval);
    const amountAvailableSinceStart = BigNumber.from(amount)
      .mul(intervalsToClaim)
      .div(WAD); // Divide by WAD to get back to normal scale

    const difference = amountAvailableSinceStart.sub(amountClaimedToDate);

    const tolerance = BigNumber.from(amount).div(BigNumber.from(10).pow(12));

    if (difference.abs().lte(tolerance)) {
      amountAvailableToClaim = BigNumber.from(0);
    } else {
      amountAvailableToClaim = difference.lt(0)
        ? BigNumber.from(0)
        : difference;
    }
  }

  return {
    amountClaimedToDate: amountClaimedToDate.toString(),
    amountAvailableToClaim: amountAvailableToClaim.toString(),
  };
};

export default useStreamingPaymentAmountsLeft;
