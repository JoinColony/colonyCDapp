import { BigNumber } from 'ethers';

import { StreamingPaymentEndCondition } from '~gql';

// Maximum uint256
export const TIMESTAMP_IN_FUTURE = BigNumber.from(2).pow(256).sub(1);

export const getEndTimeByEndCondition = ({
  endCondition,
  startTimestamp,
  interval,
  amountInWei,
  limitInWei,
  endTimestamp,
}: {
  endCondition: StreamingPaymentEndCondition;
  startTimestamp: string;
  interval: number;
  amountInWei: string;
  limitInWei?: string | null;
  endTimestamp?: string;
}) => {
  switch (endCondition) {
    case StreamingPaymentEndCondition.FixedTime: {
      if (endTimestamp === undefined) {
        throw new Error('endTimestamp is required for FixedTime endCondition');
      }

      return BigNumber.from(endTimestamp);
    }
    case StreamingPaymentEndCondition.LimitReached: {
      if (limitInWei === undefined || limitInWei === null) {
        throw new Error('limitInWei is required for LimitReached endCondition');
      }

      const limit = BigNumber.from(limitInWei ?? 0);

      return limit.eq(0)
        ? BigNumber.from(startTimestamp)
        : limit.mul(interval).div(amountInWei).add(startTimestamp);
    }

    case StreamingPaymentEndCondition.WhenCancelled: {
      return TIMESTAMP_IN_FUTURE;
    }

    default: {
      return TIMESTAMP_IN_FUTURE;
    }
  }
};
