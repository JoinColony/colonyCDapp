import { useMemo } from 'react';
import { calculateRemainingItems } from '~utils/avatars';
import { useGetUsers } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/VoteOutcome/VoteResults/helpers';
import { UserAvatarsItem } from '~v5/shared/UserAvatars/types';
import useAppContext from '../useAppContext';
import { UseUserAvatarsReturnType } from './types';

export const useUserAvatars = (
  maxAvatars: number,
  items: UserAvatarsItem[],
): UseUserAvatarsReturnType => {
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

  const registeredUsers = useGetUsers(voterAddresses);

  return {
    remainingAvatarsCount,
    registeredUsers,
  };
};
