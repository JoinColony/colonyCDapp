import { BigNumber } from 'ethers';

import { StreamingPaymentEndCondition } from '~gql';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';

// Maximum uint256
export const TIMESTAMP_IN_FUTURE = BigNumber.from(2).pow(256).sub(1);

export const getEndTimeByEndCondition = ({
  endCondition,
  startTimestamp,
  interval,
  convertedAmount,
  tokenDecimals,
  limitAmount,
  endTimestamp,
}: {
  endCondition: StreamingPaymentEndCondition;
  startTimestamp: string;
  interval: number;
  convertedAmount: BigNumber;
  tokenDecimals: number;
  limitAmount?: string | null;
  endTimestamp?: string;
}) => {
  const getOriginalAmount = (amount: BigNumber) => {
    return amount.div(
      BigNumber.from(10).pow(getTokenDecimalsWithFallback(tokenDecimals)),
    );
  };

  switch (endCondition) {
    case StreamingPaymentEndCondition.FixedTime: {
      if (endTimestamp === undefined) {
        throw new Error('endTimestamp is required for FixedTime endCondition');
      }

      return BigNumber.from(endTimestamp);
    }
    case StreamingPaymentEndCondition.LimitReached: {
      if (limitAmount === undefined || limitAmount === null) {
        throw new Error(
          'limitAmount is required for LimitReached endCondition',
        );
      }

      const originalAmount = getOriginalAmount(convertedAmount);

      const limit = BigNumber.from(limitAmount ?? 0);

      return limit.eq(0)
        ? BigNumber.from(startTimestamp)
        : limit.mul(interval).div(originalAmount).add(startTimestamp);
    }

    case StreamingPaymentEndCondition.WhenCancelled: {
      return TIMESTAMP_IN_FUTURE;
    }

    default: {
      return TIMESTAMP_IN_FUTURE;
    }
  }
};
