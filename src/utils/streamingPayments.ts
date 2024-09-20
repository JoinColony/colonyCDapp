import { BigNumber } from 'ethers';

import { ONE_DAY_IN_SECONDS, ONE_HOUR_IN_SECONDS } from '~constants/time.ts';
import { StreamingPaymentEndCondition } from '~gql';
import { type StreamingPayment } from '~types/graphql.ts';
import { StreamingPaymentStatus } from '~types/streamingPayments.ts';

import { formatText } from './intl.ts';

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

interface GetStreamingPaymentAmountsLeftReturn {
  amountClaimedToDate: string;
  amountAvailableToClaim: string;
}

export const getStreamingPaymentAmountsLeft = (
  streamingPayment: StreamingPayment | null | undefined,
  currentTimestamp: number,
): GetStreamingPaymentAmountsLeftReturn => {
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

export const checkIfStarted = ({
  isMotion,
  startTime,
  currentTimestamp,
}: {
  // @todo: update when reputation decision method will be implemented
  isMotion?: boolean;
  startTime: string;
  currentTimestamp: number;
}) => {
  if (isMotion) {
    return false;
  }

  const startTimeValue = BigNumber.from(startTime);

  return startTimeValue.lte(currentTimestamp);
};

export const checkIfEnded = ({
  endCondition,
  amountAvailableToClaim,
  limitAmount,
  isCancelled,
  endTime,
  currentTimestamp,
}: {
  endCondition: StreamingPaymentEndCondition | undefined;
  amountAvailableToClaim: string;
  limitAmount: string | null | undefined;
  isCancelled: boolean;
  endTime: string;
  currentTimestamp: number;
}) => {
  if (!endCondition) {
    return {
      ended: false,
      status: StreamingPaymentStatus.NotStarted,
    };
  }

  switch (endCondition) {
    case StreamingPaymentEndCondition.LimitReached:
      return {
        ended: BigNumber.from(amountAvailableToClaim).eq(
          BigNumber.from(limitAmount),
        ),
        status: StreamingPaymentStatus.LimitReached,
      };
    case StreamingPaymentEndCondition.WhenCancelled:
      return { ended: isCancelled, status: StreamingPaymentStatus.Cancelled };
    default: {
      const endTimeValue = BigNumber.from(endTime);

      return {
        ended: endTimeValue.lte(currentTimestamp),
        status: StreamingPaymentStatus.Ended,
      };
    }
  }
};

export const getStatus = ({
  streamingPayment,
  currentTimestamp,
  isMotion,
  amountAvailableToClaim,
}: {
  streamingPayment: StreamingPayment | null | undefined;
  currentTimestamp: number;
  isMotion?: boolean;
  amountAvailableToClaim: string;
}) => {
  if (!streamingPayment) {
    return StreamingPaymentStatus.NotStarted;
  }

  const { endTime, startTime, isCancelled, metadata } = streamingPayment;
  const { endCondition } = metadata || {};
  const limitAmount = getStreamingPaymentLimit({ streamingPayment });
  const started = checkIfStarted({
    isMotion,
    startTime,
    currentTimestamp,
  });
  const { ended, status } = checkIfEnded({
    amountAvailableToClaim,
    endCondition,
    endTime,
    isCancelled: isCancelled ?? false,
    limitAmount,
    currentTimestamp,
  });

  if (!started) {
    return StreamingPaymentStatus.NotStarted;
  }

  if (!ended) {
    return StreamingPaymentStatus.Active;
  }

  return status;
};

export const getAmountPerValue = (interval: string) => {
  switch (interval) {
    case `${ONE_HOUR_IN_SECONDS}`:
      return formatText({ id: 'actionSidebar.amountPer.options.hour' });
    case `${ONE_DAY_IN_SECONDS}`:
      return formatText({ id: 'actionSidebar.amountPer.options.day' });
    case `${ONE_DAY_IN_SECONDS * 7}`:
      return formatText({ id: 'actionSidebar.amountPer.options.week' });
    default:
      return formatText(
        { id: 'streamingPayment.description.days' },
        {
          days: BigNumber.from(interval).div(ONE_DAY_IN_SECONDS).toNumber(),
        },
      );
  }
};
