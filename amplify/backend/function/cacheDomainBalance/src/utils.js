const {
  startOfDay, subDays,
  startOfWeek, subWeeks,
  startOfMonth, subMonths,
  startOfYear, subYears,
  isSameDay
} = require('date-fns')

const TimeframeType = {
  DAILY: "DAILY",
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  TOTAL: "TOTAL"
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


module.exports = {
  TimeframeType,
  getDaysFromNow,
  getWeeksFromNow,
  getMonthsFromNow,
  getYearsFromNow,
  isSameDay
};
