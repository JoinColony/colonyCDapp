export const daysFromRefDate = (date: Date | null) =>
  date &&
  Math.floor((date.getTime() - date.getTimezoneOffset() * 60000) / 86400000);
