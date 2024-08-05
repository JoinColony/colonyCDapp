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

const getPeriodFromNow = (timeframePeriod, timeframeType) => {
  switch (timeframeType) {
    case TimeframeType.DAILY: {
      return getDaysFromNow(timeframePeriod)
    }
    case TimeframeType.WEEKLY: {
      return getWeeksFromNow(timeframePeriod)
    }
    case TimeframeType.MONTHLY: {
      return getMonthsFromNow(timeframePeriod)
    }
    default: {
      return getYearsFromNow(timeframePeriod)
    }
  }
}

const getYearsFromNow = (numberOfYears) => {
  const now = new Date();
  return startOfDay(new Date(startOfYear(new Date(subYears(now, numberOfYears)))));
}

const getMonthsFromNow = (numberOfMonths) => {
  const now = new Date();
  return startOfDay(new Date(startOfMonth(new Date(subMonths(now, numberOfMonths)))));
}

const getWeeksFromNow = (numberOfWeeks) => {
  const now = new Date();
  return startOfDay(new Date(startOfWeek(new Date(subWeeks(now, numberOfWeeks)))));
}

const getDaysFromNow = (numberOfDays) => {
  const now = new Date();
  return startOfDay(new Date(subDays(now, numberOfDays)))
};

const getPeriodFormat = (date, timeframeType) => {
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

const getFormattedIncomingFunds = (incomingFunds, parentDomainAddress) =>
  incomingFunds.map(incomingFund => ({
    amount: incomingFund.amount,
    finalizedDate: incomingFund.updatedAt,
    token: incomingFund.token,
    toDomainId: parentDomainAddress,
  }));

const getFormattedExpenditures = (expenditures, parentDomainAddress) => {
  const formattedExpenditures = [];
  expenditures.forEach(expenditure => {
    expenditure?.slots.forEach(slot => {
      slot.payouts.forEach(payout => {
        if (payout.isClaimed) {
          formattedExpenditures.push({
            fromDomainId: parentDomainAddress,
            amount: payout.amount,
            networkFee: payout.networkFee,
            finalizedDate: fromUnixTime(expenditure.finalizedAt),
            token: {
              id: payout.tokenAddress,
              // @TODO need to get token decimals
              decimals: 18,
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
  getMonthsFromNow,
  getDaysFromNow,
  getMonthFormat,
  buildAPIEndpoint,
  getStartOfDayFor,
  isAfter,
  isBefore
};
