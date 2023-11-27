import { WatchListItem } from '~types';

export const sortByDate = (
  firstWatchEntry: WatchListItem,
  secondWatchEntry: WatchListItem,
) => {
  const firstWatchTime = new Date(firstWatchEntry?.createdAt || 1).getTime();
  const secondWatchTime = new Date(secondWatchEntry?.createdAt || 1).getTime();

  return firstWatchTime - secondWatchTime;
};
