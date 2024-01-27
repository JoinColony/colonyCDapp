import { useMemo } from 'react';

import { useAppContext } from '~context/AppContext.tsx';
import { UserFragment } from '~gql';
import useUsersByAddresses from '~hooks/useUsersByAddresses.ts';
import { notNull } from '~utils/arrays/index.ts';
import { calculateRemainingItems } from '~utils/avatars.ts';
import { UserAvatarsItem } from '~v5/shared/UserAvatars/types.ts';

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
