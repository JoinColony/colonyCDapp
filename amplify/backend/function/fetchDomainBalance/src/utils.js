const { subMonths, subDays, startOfDay, startOfMonth, format } = require('date-fns')

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

const getMonthsFromNow = (numberOfMonths) => {
  const now = new Date();
  return startOfDay(new Date(startOfMonth(new Date(subMonths(now, numberOfMonths)))));
}

const getDaysFromNow = (numberOfDays) => {
  const now = new Date();
  return startOfDay(new Date(subDays(now, numberOfDays)))
};

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

module.exports = {
  getActionWithFinalizedDate,
  getMonthsFromNow,
  getDaysFromNow,
  getMonthFormat,
  buildAPIEndpoint
};
