const {
  startOfDay, subDays,
  startOfWeek, subWeeks,
  startOfMonth, subMonths,
  startOfYear, subYears,
  fromUnixTime, format, formatISO, isAfter, isBefore
} = require('date-fns')

const TimeframeType = {
  DAILY: "DAILY",
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  TOTAL: "TOTAL"
}

const getActionFinalizedDate = (action) => {
  if (action.isMotion) {
    const motionData = action.motionData;
    return motionData.motionStateHistory.hasPassed && motionData.motionStateHistory.finalizedAt ? motionData.motionStateHistory.finalizedAt : null;
  }

  return action.updatedAt;
}

const getActionWithFinalizedDate = (action) => ({
  ...action,
  finalizedDate: getActionFinalizedDate(action)
})

const getPeriodFromNow = (timeframePeriod, timeframeType, timeframePeriodEndDate) => {
  switch (timeframeType) {
    case TimeframeType.DAILY: {
      return getDaysFromNow(timeframePeriod, timeframePeriodEndDate)
    }
    case TimeframeType.WEEKLY: {
      return getWeeksFromNow(timeframePeriod, timeframePeriodEndDate)
    }
    case TimeframeType.MONTHLY: {
      return getMonthsFromNow(timeframePeriod, timeframePeriodEndDate)
    }
    case TimeframeType.TOTAL: {
      return null;
    }
    default: {
      return getYearsFromNow(timeframePeriod, timeframePeriodEndDate)
    }
  }
}

const getYearsFromNow = (numberOfYears, timeframePeriodEndDate) => {
  const now = timeframePeriodEndDate ? new Date(timeframePeriodEndDate) : new Date();
  return startOfDay(new Date(startOfYear(new Date(subYears(now, numberOfYears)))));
}

const getMonthsFromNow = (numberOfMonths, timeframePeriodEndDate) => {
  const now = timeframePeriodEndDate ? new Date(timeframePeriodEndDate) : new Date();
  return startOfDay(new Date(startOfMonth(new Date(subMonths(now, numberOfMonths)))));
}

const getWeeksFromNow = (numberOfWeeks, timeframePeriodEndDate) => {
  const now = timeframePeriodEndDate ? new Date(timeframePeriodEndDate) : new Date();
  return startOfDay(new Date(startOfWeek(new Date(subWeeks(now, numberOfWeeks)))));
}

const getDaysFromNow = (numberOfDays, timeframePeriodEndDate) => {
  const now = timeframePeriodEndDate ? new Date(timeframePeriodEndDate) : new Date();
  return startOfDay(new Date(subDays(now, numberOfDays)))
};

const getPeriodFormat = (date, timeframeType) => {
  if (!date || timeframeType === TimeframeType.TOTAL) {
    return '0'
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

  return format(new Date(date), formattingPattern)
}

const getMonthFormat = (date) =>
  format(new Date(date), 'MMM')

const buildAPIEndpoint = (
  url,
  queryParams
) => {
  Object.keys(queryParams).forEach((key) =>
    url.searchParams.append(key, queryParams[key]),
  );
  return url.href;
};

const getStartOfDayFor = (date) =>
  formatISO(new Date(startOfDay(new Date(date))));

const getFormattedIncomingFunds = (incomingFunds, parentDomainId) =>
  incomingFunds.map(incomingFund => ({
    amount: incomingFund.amount,
    finalizedDate: incomingFund.updatedAt,
    token: incomingFund.token,
    toDomainId: parentDomainId,
  }));

const getTokenAddressesFromExpenditures = (expenditures) => {
  const tokenAddresses = [];
  expenditures.forEach(expenditure => {
    expenditure?.slots.forEach(slot => {
      slot.payouts.forEach(payout => {
        if (!tokenAddresses.includes(payout.tokenAddress)) {
          tokenAddresses.push(payout.tokenAddress);
        }
      })
    })
  });

  return tokenAddresses;
};

const getFormattedExpenditures = (expenditures, parentDomainId, tokensDecimals) => {
  const formattedExpenditures = [];
  expenditures.forEach(expenditure => {
    expenditure?.slots.forEach(slot => {
      slot.payouts.forEach(payout => {
        if (payout.isClaimed) {
          const formattedFinalizedAt = fromUnixTime(expenditure.finalizedAt);
          // Noticed on DEV expenditure.finalizedAt timestamp is before expenditure.createdAt
          const finalizedDate =
            isAfter(new Date(expenditure.createdAt), new Date(formattedFinalizedAt)) ? expenditure.createdAt : formattedFinalizedAt;
          formattedExpenditures.push({
            fromDomainId: parentDomainId,
            amount: payout.amount,
            networkFee: payout.networkFee,
            finalizedDate,
            token: {
              id: payout.tokenAddress,
              decimals: tokensDecimals[payout.tokenAddress],
            }
          })
        }
      })
    })
  })
  return formattedExpenditures;
}

module.exports = {
  getPeriodFormat,
  getPeriodFromNow,
  getActionWithFinalizedDate,
  getFormattedIncomingFunds,
  getFormattedExpenditures,
  getTokenAddressesFromExpenditures,
  getMonthsFromNow,
  getDaysFromNow,
  getMonthFormat,
  buildAPIEndpoint,
  getStartOfDayFor,
  isAfter,
  isBefore
};
