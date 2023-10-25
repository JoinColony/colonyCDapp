import React, { useMemo } from 'react';
import {
  calculateLastSliceIndex,
  calculateRemainingItems,
} from '~utils/avatars';
import UserAvatar from '~v5/shared/UserAvatar';
import { MembersAvatarsProps } from './types';
import { VoterRecordFragment } from '~gql';
import { useAppContext } from '~hooks';
import { useGetUsers } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/VoteOutcome/VoteResults/helpers';
import { User } from '~types';

const displayName =
  'v5.common.ActionSidebar.partials.motions.Motion.steps.OutcomeStep.partials.MembersAvatars';

function MembersAvatars<TValue extends VoterRecordFragment>({
  items,
  maxAvatars = 4,
  className,
}: MembersAvatarsProps<TValue>): JSX.Element {
  const remainingAvatarsCount = calculateRemainingItems(maxAvatars, items);
  const { user } = useAppContext();
  const voterAddresses = useMemo(
    // We need a stable reference to this array to avoid an infinite loop in `useGetUsers`
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

  const registeredVoters = useGetUsers(voterAddresses);

  return (
    <div className={className}>
      <ul className="flex relative">
        {registeredVoters?.map((registeredVoter: User) => (
          <li key={registeredVoter.walletAddress} className="-ml-3">
            <UserAvatar
              user={registeredVoter}
              size="sm"
              borderClassName="border-base-white border rounded-full"
            />
          </li>
        ))}
        {!!remainingAvatarsCount && (
          <li
            className={`flex items-center justify-center w-[1.875rem] h-[1.875rem] border border-base-white
              rounded-full bg-gray-50 text-xs font-semibold text-gray-700 -ml-3 z-10`}
          >
            {`+ ${remainingAvatarsCount}`}
          </li>
        )}
      </ul>
    </div>
  );
}

MembersAvatars.displayName = displayName;

export default MembersAvatars;
