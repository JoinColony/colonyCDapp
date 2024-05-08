import { BigNumber } from 'ethers';

import { type StreamingPayment } from '~types/graphql.ts';

const useStreamingPaymentAmountsLeft = (
  streamingPayment: StreamingPayment | null | undefined,
  currentTimestamp: number,
) => {
  if (!streamingPayment) {
    return {
      amountsClaimedToDate: {},
      amountsAvailableToClaim: {},
    };
  }

  const amountsClaimedToDate: { [tokenAddress: string]: BigNumber } =
    streamingPayment.claims?.reduce((amounts, claim) => {
      let newAmount = BigNumber.from(claim.amount);

      if (amounts[claim.tokenAddress]) {
        newAmount = BigNumber.from(claim.amount).add(
          amounts[claim.tokenAddress],
        );
      }

      return { ...amounts, [claim.tokenAddress]: newAmount };
    }, {}) ?? {};

  const amountsAvailableToClaim = streamingPayment.payouts
    ? streamingPayment.payouts.reduce((amounts, payout) => {
        let newAmount = BigNumber.from(0);
        if (streamingPayment.startTime >= currentTimestamp) {
          return { amounts, [payout.tokenAddress]: newAmount };
        }

        const durationToClaim =
          Math.min(currentTimestamp, streamingPayment.endTime) -
          streamingPayment.startTime;

        if (!durationToClaim) {
          return { amounts, [payout.tokenAddress]: newAmount };
        }

        const amountAvailableSinceStart = BigNumber.from(payout.amount)
          .mul(
            BigNumber.from(durationToClaim)
              .mul(BigNumber.from(10).pow(18))
              .div(BigNumber.from(streamingPayment.interval)),
          )
          .div(BigNumber.from(10).pow(18));

        const amountClaimedToDate = BigNumber.from(
          amountsClaimedToDate[payout.tokenAddress] || 0,
        );

        newAmount = amountAvailableSinceStart.sub(amountClaimedToDate);

        newAmount = newAmount.lt(0) ? BigNumber.from(0) : newAmount;

        return { amounts, [payout.tokenAddress]: newAmount };
      }, {})
    : {};

  return {
    amountsClaimedToDate,
    amountsAvailableToClaim,
  };
};

export default useStreamingPaymentAmountsLeft;
