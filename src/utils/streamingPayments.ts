import { BigNumber } from 'ethers';

import {
  ONE_DAY_IN_SECONDS,
  ONE_HOUR_IN_SECONDS,
  SECONDS_IN_MONTH,
} from '~constants/time.ts';
import {
  StreamingPaymentEndCondition,
  type StreamingPaymentFragment,
} from '~gql';
import { type StreamingPayment } from '~types/graphql.ts';
import { StreamingPaymentStatus } from '~types/streamingPayments.ts';

import { formatText } from './intl.ts';

interface GetStreamingPaymentAmountsLeftReturn {
  amountClaimedToDate: string;
  amountAvailableToClaim: string;
}

export const getStreamingPaymentCreatingActionId = (
  streamingPayment?: StreamingPaymentFragment | null,
) => streamingPayment?.creatingActions?.items?.[0]?.transactionHash ?? '';

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

    const PRECISION = BigNumber.from(10).pow(18);
    const intervalBigNumber = BigNumber.from(interval);

    const amountAvailableSinceStart = BigNumber.from(amount)
      .mul(durationToClaim)
      .mul(PRECISION)
      .div(intervalBigNumber.mul(PRECISION));

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

export const checkIfStreamingPaymentStarted = ({
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

export const checkIfStreamingPaymentEnded = ({
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

  if (isCancelled) {
    return {
      ended: true,
      status: StreamingPaymentStatus.Cancelled,
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

export const getStreamingPaymentStatus = ({
  streamingPayment,
  currentTimestamp,
  isMotion,
}: {
  streamingPayment: StreamingPayment | null | undefined;
  currentTimestamp: number;
  isMotion?: boolean;
}) => {
  if (!streamingPayment) {
    return StreamingPaymentStatus.NotStarted;
  }

  const { endTime, startTime, isCancelled, metadata } = streamingPayment;
  const { endCondition } = metadata || {};
  const limitAmount = getStreamingPaymentLimit({ streamingPayment });
  const started = checkIfStreamingPaymentStarted({
    isMotion,
    startTime,
    currentTimestamp,
  });

  const { amountAvailableToClaim } = getStreamingPaymentAmountsLeft(
    streamingPayment,
    currentTimestamp,
  );

  const { ended, status } = checkIfStreamingPaymentEnded({
    amountAvailableToClaim,
    endCondition,
    endTime,
    isCancelled: isCancelled ?? false,
    limitAmount,
    currentTimestamp,
  });

  if (!started && !isCancelled) {
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

export const convertToMonthlyAmount = (
  amount: BigNumber,
  interval: BigNumber,
): BigNumber => {
  const intervalsPerMonth = BigNumber.from(SECONDS_IN_MONTH).div(interval);

  return amount.mul(intervalsPerMonth);
};
