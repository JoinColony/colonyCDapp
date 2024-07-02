import { isBefore, parseISO, subWeeks } from 'date-fns';

export const hasWeekPassed = (createdAt: string) => {
  const createdAtDate = parseISO(createdAt);

  const currentDate = new Date();

  const oneWeekAgo = subWeeks(currentDate, 1);

  return isBefore(createdAtDate, oneWeekAgo);
};
