import isDate from 'date-fns/isDate';
import { BigNumber } from 'ethers';

import { ONE_DAY_IN_SECONDS, ONE_HOUR_IN_SECONDS } from '~constants/time.ts';
import { StreamingPaymentEndCondition } from '~gql';
import { type CreateStreamingPaymentPayload } from '~redux/sagas/expenditures/createStreamingPayment.ts';
import { DecisionMethod } from '~types/actions.ts';
import { type Colony } from '~types/graphql.ts';
import { findDomainByNativeId } from '~utils/domains.ts';
import {
  getSelectedToken,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';
import { AmountPerInterval } from '~v5/common/ActionSidebar/partials/AmountPerPeriodRow/types.ts';
import { START_IMMEDIATELY_VALUE } from '~v5/common/ActionSidebar/partials/TimeRow/consts.ts';

import { type StreamingPaymentFormValues } from './hooks.ts';

export const getInterval = (period: StreamingPaymentFormValues['period']) => {
  switch (period.interval) {
    case AmountPerInterval.Hour:
      return ONE_HOUR_IN_SECONDS;
    case AmountPerInterval.Day:
      return ONE_DAY_IN_SECONDS;
    case AmountPerInterval.Week:
      return ONE_DAY_IN_SECONDS * 7;
    case AmountPerInterval.Custom:
      return period.custom;
    default:
      return 0;
  }
};

export const getStreamingPaymentPayload = (
  colony: Colony,
  values: StreamingPaymentFormValues,
  blockTime: number | null,
): CreateStreamingPaymentPayload | null => {
  const {
    amount,
    tokenAddress,
    description: annotationMessage,
    createdIn,
    recipient,
    period,
    ends,
    starts,
    limit,
    from,
    decisionMethod,
  } = values;

  const selectedToken = getSelectedToken(colony, tokenAddress);
  const decimals = getTokenDecimalsWithFallback(selectedToken?.decimals);
  const createdInDomain = findDomainByNativeId(createdIn, colony);
  const fromDomain = findDomainByNativeId(from, colony);

  if (!createdInDomain || !fromDomain) {
    return null;
  }

  const interval = getInterval(period);

  if (!interval) {
    return null;
  }

  return {
    colonyAddress: colony.colonyAddress,
    createdInDomain:
      decisionMethod === DecisionMethod.Reputation
        ? createdInDomain
        : fromDomain,
    amount,
    endCondition: isDate(ends) ? StreamingPaymentEndCondition.FixedTime : ends,
    interval,
    recipientAddress: recipient ?? '',
    startTimestamp:
      starts === START_IMMEDIATELY_VALUE
        ? BigNumber.from(
            Math.floor(blockTime ?? new Date().getTime() / 1000),
          ).toString()
        : BigNumber.from(
            Math.floor(new Date(starts).getTime() / 1000),
          ).toString(),
    tokenAddress,
    tokenDecimals: decimals,
    endTimestamp: isDate(ends)
      ? BigNumber.from(Math.floor(new Date(ends).getTime() / 1000)).toString()
      : undefined,
    limitAmount:
      ends === StreamingPaymentEndCondition.LimitReached ? limit : undefined,
    annotationMessage,
  };
};
