import { isBefore, parseISO, subWeeks } from 'date-fns';

export const getIsMotionOlderThanAWeek = (
  createdAt: string,
  currentBlockTime: number,
) => {
  const createdAtDate = parseISO(createdAt);

  const currentDate = new Date(currentBlockTime);

  const oneWeekAgo = subWeeks(currentDate, 1);

  return isBefore(createdAtDate, oneWeekAgo);
};
