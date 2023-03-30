import { Colony, User } from '~types';

/* Find in users watchlist if watching a specific colony */
export const getWatchedColony = (
  colony?: Colony,
  items?: NonNullable<User['watchlist']>['items'],
): NonNullable<User['watchlist']>['items'][number] | undefined => {
  return (items ?? []).find(
    (item) => item?.colony?.colonyAddress === colony?.colonyAddress,
  );
};
