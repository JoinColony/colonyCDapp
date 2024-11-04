const {
  differenceInSeconds,
  startOfDay,
  subDays,
  startOfWeek,
  subWeeks,
  startOfMonth,
  subMonths,
  startOfYear,
  subYears,
  fromUnixTime,
  format,
  formatISO,
  isAfter,
  isBefore,
} = require('date-fns');

const DEFAULT_TOKEN_DECIMALS = 18;

const TimeframeType = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  TOTAL: 'TOTAL',
};

const paymentActionTypes = ['PAYMENT', 'PAYMENT_MOTION', 'PAYMENT_MULTISIG'];

const moveFundsActionTypes = [
  'MOVE_FUNDS',
  'MOVE_FUNDS_MOTION',
  'MOVE_FUNDS_MULTISIG',
];

const acceptedColonyActionTypes = [
  ...paymentActionTypes,
  ...moveFundsActionTypes,
];

const getActionFinalizedDate = (action) => {
  if (action.isMotion && action.motionData) {
    const motionData = action.motionData;
    return motionData.motionStateHistory.hasPassed &&
      motionData.motionStateHistory.finalizedAt
      ? motionData.motionStateHistory.finalizedAt
      : null;
  }

  if (action.isMultiSig && action.multiSigData) {
    const multiSigData = action.multiSigData;
    return multiSigData.isExecuted && multiSigData.executedAt
      ? multiSigData.executedAt
      : null;
  }

  return action.updatedAt;
};

const getActionWithFinalizedDate = (action) => ({
  ...action,
  finalizedDate: getActionFinalizedDate(action),
});

const getPeriodFor = (
  timeframePeriod,
  timeframeType,
  timeframePeriodEndDate,
) => {
  switch (timeframeType) {
    case TimeframeType.DAILY: {
      return subtractDaysFor(timeframePeriod, timeframePeriodEndDate);
    }
    case TimeframeType.WEEKLY: {
      return subtractWeeksFor(timeframePeriod, timeframePeriodEndDate);
    }
    case TimeframeType.MONTHLY: {
      return subtractMonthsFor(timeframePeriod, timeframePeriodEndDate);
    }
    case TimeframeType.TOTAL: {
      return null;
    }
    default: {
      return subtractYearsFor(timeframePeriod, timeframePeriodEndDate);
    }
  }
};

const subtractYearsFor = (numberOfYears, timeframePeriodEndDate) => {
  const now = timeframePeriodEndDate
    ? new Date(timeframePeriodEndDate)
    : new Date();
  return startOfDay(
    new Date(startOfYear(new Date(subYears(now, numberOfYears)))),
  );
};

const subtractMonthsFor = (numberOfMonths, timeframePeriodEndDate) => {
  const now = timeframePeriodEndDate
    ? new Date(timeframePeriodEndDate)
    : new Date();
  return startOfDay(
    new Date(startOfMonth(new Date(subMonths(now, numberOfMonths)))),
  );
};

const subtractWeeksFor = (numberOfWeeks, timeframePeriodEndDate) => {
  const now = timeframePeriodEndDate
    ? new Date(timeframePeriodEndDate)
    : new Date();
  return startOfDay(
    new Date(startOfWeek(new Date(subWeeks(now, numberOfWeeks)))),
  );
};

const subtractDaysFor = (numberOfDays, timeframePeriodEndDate) => {
  const now = timeframePeriodEndDate
    ? new Date(timeframePeriodEndDate)
    : new Date();
  return startOfDay(new Date(subDays(now, numberOfDays)));
};

const getPeriodFormat = (date, timeframeType) => {
  if (!date || timeframeType === TimeframeType.TOTAL) {
    return '0';
  }

  let formattingPattern = ``;

  switch (timeframeType) {
    case TimeframeType.DAILY: {
      formattingPattern = 'dd';
      break;
    }
    case TimeframeType.WEEKLY: {
      formattingPattern = 'ww';
      break;
    }
    case TimeframeType.MONTHLY: {
      formattingPattern = 'MM';
      break;
    }
    default: {
      formattingPattern = 'yyyy';
      break;
    }
  }

  return format(new Date(date), formattingPattern);
};

const getMonthFormat = (date) => format(new Date(date), 'MMM');

const buildAPIEndpoint = (url, queryParams) => {
  Object.keys(queryParams).forEach((key) =>
    url.searchParams.append(key, queryParams[key]),
  );
  return url.href;
};

const getStartOfDayFor = (date) =>
  formatISO(new Date(startOfDay(new Date(date))));

const getFormattedIncomingFunds = (incomingFunds, domainId) =>
  incomingFunds.map((incomingFund) => ({
    amount: incomingFund.amount,
    finalizedDate: incomingFund.updatedAt,
    token: incomingFund.token,
    // This value will only ever be undefined if the "All teams" filter is selected
    // or 1 if the "Root domain" filter is selected
    toDomainId: domainId,
  }));

const getTokenAddressesFromExpenditures = (expenditures) => {
  const tokenAddresses = [];
  expenditures.forEach((expenditure) => {
    expenditure?.slots.forEach((slot) => {
      slot.payouts.forEach((payout) => {
        if (!tokenAddresses.includes(payout.tokenAddress)) {
          tokenAddresses.push(payout.tokenAddress);
        }
      });
    });
  });

  return tokenAddresses;
};

/**
 * This helper is mostly needed for treating the case of colony-level actions and adding the finalizedDate
 */
const getFormattedActions = (actions, domainId) => {
  // Separating the actions created as extension support
  let extensionSupportActions = actions.filter(
    (action) => !!action.initiatorExtension?.id,
  );

  return actions
    .filter((action) => !action.initiatorExtension?.id)
    .map((action) => getActionWithFinalizedDate(action))
    .filter((action) => !!action.finalizedDate)
    .map((action) => {
      let amount = action.amount;
      let networkFee = action.networkFee;

      /**
       * If there is no domain selected (aka we are at colony level) and the action type is not among payments, we'll consider the amount to be '0'
       * Though we might need to reconsider this when transferring funds between colonies
       */
      if (!domainId && !paymentActionTypes.includes(action.type)) {
        amount = '0';
      }

      const attachedAction = extensionSupportActions.find(
        (extensionSupportAction) =>
          extensionSupportAction.rootHash === action.rootHash,
      );

      if (attachedAction) {
        networkFee = attachedAction.networkFee;
      }

      return {
        ...action,
        amount,
        networkFee,
      };
    });
};

const getFormattedExpenditures = (expenditures, domainId, tokensDecimals) => {
  const formattedExpenditures = [];
  expenditures.forEach((expenditure) => {
    expenditure?.slots.forEach((slot) => {
      slot.payouts.forEach((payout) => {
        if (payout.isClaimed) {
          const formattedFinalizedAt = fromUnixTime(expenditure.finalizedAt);
          // Noticed on DEV expenditure.finalizedAt timestamp is before expenditure.createdAt
          const finalizedDate = isAfter(
            new Date(expenditure.createdAt),
            new Date(formattedFinalizedAt),
          )
            ? expenditure.createdAt
            : formattedFinalizedAt;
          formattedExpenditures.push({
            fromDomainId: domainId,
            amount: payout.amount,
            networkFee: payout.networkFee,
            finalizedDate,
            token: {
              id: payout.tokenAddress,
              decimals: tokensDecimals[payout.tokenAddress],
            },
          });
        }
      });
    });
  });
  return formattedExpenditures;
};

const getDifferenceInSeconds = (startDateTimestamp, endDateTimestamp) => {
  const endDate = endDateTimestamp ? new Date(endDateTimestamp) : new Date();

  const startDate = startDateTimestamp
    ? new Date(startDateTimestamp)
    : new Date();

  return differenceInSeconds(startDate, endDate, { roundingMethod: 'ceil' });
};

const shouldFetchNetworkBalance = (timeframeType) =>
  timeframeType === TimeframeType.TOTAL;

module.exports = {
  DEFAULT_TOKEN_DECIMALS,
  acceptedColonyActionTypes,
  getDifferenceInSeconds,
  getPeriodFormat,
  getPeriodFor,
  getFormattedIncomingFunds,
  getFormattedActions,
  getFormattedExpenditures,
  getTokenAddressesFromExpenditures,
  subtractMonthsFor,
  subtractDaysFor,
  getMonthFormat,
  buildAPIEndpoint,
  getStartOfDayFor,
  isAfter,
  isBefore,
  shouldFetchNetworkBalance,
};
