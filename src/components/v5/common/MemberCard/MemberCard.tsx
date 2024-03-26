import { SealCheck } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import ContributorTypeWrapper from '~v5/shared/ContributorTypeWrapper/ContributorTypeWrapper.tsx';
import MeatBallMenu from '~v5/shared/MeatBallMenu/index.ts';
import ReputationBadge from '~v5/shared/ReputationBadge/index.ts';
import RolesTooltip from '~v5/shared/RolesTooltip/RolesTooltip.tsx';
import { UserAvatar } from '~v5/shared/UserAvatar/UserAvatar.tsx';
import UserInfoPopover from '~v5/shared/UserInfoPopover/UserInfoPopover.tsx';

import { type MemberCardProps } from './types.ts';

const displayName = 'v5.common.MemberCard';

const MemberCard: FC<MemberCardProps> = ({
  userAddress,
  user,
  meatBallMenuProps,
  reputation,
  role,
  contributorType,
  isVerified,
}) => {
  const userName = user?.profile?.displayName || userAddress;

  return (
    <div className="flex h-full w-full flex-col rounded-lg border border-gray-200 bg-gray-25 p-5">
      <div className="relative flex w-full flex-grow flex-col items-center justify-center">
        <UserInfoPopover
          walletAddress={userAddress}
          user={user}
          withVerifiedBadge={false}
          popperOptions={{
            placement: 'bottom-start',
          }}
          className="flex w-full flex-grow flex-col items-center justify-between gap-2 text-gray-900"
        >
          <ContributorTypeWrapper contributorType={contributorType}>
            <UserAvatar
              userAvatarSrc={user?.profile?.avatar ?? undefined}
              userName={user?.profile?.displayName ?? undefined}
              userAddress={userAddress}
              size={60}
            />
          </ContributorTypeWrapper>
          <p className="flex max-w-full items-center justify-center text-center text-1">
            <span className="inline-block w-full truncate">{userName}</span>
            {isVerified && (
              <SealCheck
                size={14}
                className="ml-1 flex-shrink-0 text-blue-400"
              />
            )}
          </p>
        </UserInfoPopover>
        <div className="absolute right-0 top-0">
          <MeatBallMenu withVerticalIcon {...meatBallMenuProps} />
        </div>
      </div>
      {(reputation !== undefined || role) && (
        <div className="mt-[.6875rem] flex w-full items-center justify-between gap-4 border-t border-t-gray-200 pt-[.6875rem]">
          {reputation !== undefined && (
            <ReputationBadge
              className="min-h-[1.625rem]"
              reputation={reputation}
            />
          )}
          {role && (
            <div className="ml-auto">
              <RolesTooltip role={role} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

MemberCard.displayName = displayName;

export default MemberCard;
