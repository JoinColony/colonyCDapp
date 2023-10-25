import React from 'react';
import { Id } from '@colony/colony-js';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import {
  calculateLastSliceIndex,
  calculateRemainingItems,
} from '~utils/avatars';
import { notNull } from '~utils/arrays';
import UserAvatar from '~v5/shared/UserAvatar';
import { MembersAvatarsProps } from './types';
import { Watcher } from '~types';

const displayName =
  'v5.common.ActionSidebar.partials.motions.Motion.steps.OutcomeStep.partials.MembersAvatars';

function MembersAvatars<TValue extends Watcher>({
  items,
  currentDomainId = COLONY_TOTAL_BALANCE_DOMAIN_ID,
  maxAvatarsToShow = 4,
  className,
}: MembersAvatarsProps<TValue>): JSX.Element {
  const remainingAvatarsCount = calculateRemainingItems(
    maxAvatarsToShow,
    items ?? [],
    false,
  );

  return (
    <div className={className}>
      {(currentDomainId === Id.RootDomain ||
        currentDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID) && (
        <ul className="flex relative">
          {items
            .slice(0, calculateLastSliceIndex(maxAvatarsToShow, items, false))
            .filter(notNull)
            .map((member) => (
              <li key={member.address} className="-ml-3">
                <UserAvatar
                  user={member.user}
                  size="sm"
                  className="border-base-white border rounded-full"
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
      )}
    </div>
  );
}

MembersAvatars.displayName = displayName;

export default MembersAvatars;
