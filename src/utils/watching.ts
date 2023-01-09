import { Colony, User } from '~types';

/* Find in users watchlist if watching a specific colony */
export const watchingColony = (
  colony: Colony | undefined,
  user: User | null | undefined,
): any => {
  return (user?.watchlist?.items || []).find(
    (item) => item?.colony?.colonyAddress === colony?.colonyAddress,
  );
};
