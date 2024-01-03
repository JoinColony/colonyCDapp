import { useMemo } from 'react';

import { UserFragment } from '~gql';
import { useAppContext, useUsersByAddresses } from '~hooks';
import { notNull } from '~utils/arrays';
import { calculateRemainingItems } from '~utils/avatars';
import { UserAvatarsItem } from '~v5/shared/UserAvatars/types';

export const useUserAvatars = (
  maxAvatars: number,
  items: UserAvatarsItem[],
): {
  remainingAvatarsCount: number;
  registeredUsers: UserFragment[];
} => {
  const remainingAvatarsCount = calculateRemainingItems(maxAvatars, items);
  const { user } = useAppContext();

  const voterAddresses = useMemo(
    () =>
      items.reduce<string[]>((acc, { address }) => {
        if (address === user?.walletAddress) {
          acc.unshift(address);
        } else {
          acc.push(address);
        }
        return acc;
      }, []),
    [items, user],
  );

  const { users: registeredUsers = [] } = useUsersByAddresses(
    /*
     * @NOTE Due to how the or filter works
     * If the array would be empty it would return all users
     */
    voterAddresses.length ? voterAddresses : [''],
  );

  return {
    remainingAvatarsCount,
    registeredUsers: registeredUsers.filter(notNull),
  };
};
