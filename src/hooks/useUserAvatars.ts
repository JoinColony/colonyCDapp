import { useMemo } from 'react';
import {
  calculateLastSliceIndex,
  calculateRemainingItems,
} from '~utils/avatars';
import useAppContext from './useAppContext';
import { useGetUsers } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/VoteOutcome/VoteResults/helpers';
import { VoterRecord } from '~gql';

export const useUserAvatars = (maxAvatars: number, items: VoterRecord[]) => {
  const remainingAvatarsCount = calculateRemainingItems(maxAvatars, items);
  const { user } = useAppContext();
  const voterAddresses = useMemo(
    () =>
      items
        .reduce<string[]>((acc, { address }) => {
          if (address === user?.walletAddress) {
            acc.unshift(address);
          } else {
            acc.push(address);
          }
          return acc;
        }, [])
        .slice(0, calculateLastSliceIndex(maxAvatars, items)),
    [maxAvatars, items, user],
  );

  const registeredUsers = useGetUsers(voterAddresses);

  return {
    remainingAvatarsCount,
    registeredUsers,
  };
};
