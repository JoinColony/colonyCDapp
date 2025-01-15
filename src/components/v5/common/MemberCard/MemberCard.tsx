import { Id } from '@colony/colony-js';
import { SealCheck } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { splitAddress } from '~utils/strings.ts';
import ContributorTypeWrapper from '~v5/shared/ContributorTypeWrapper/ContributorTypeWrapper.tsx';
import MeatBallMenu from '~v5/shared/MeatBallMenu/index.ts';
import ReputationBadge from '~v5/shared/ReputationBadge/index.ts';
import { UserAvatar } from '~v5/shared/UserAvatar/UserAvatar.tsx';
import PermissionTooltip from '~v5/shared/UserInfoPopover/partials/PermissionTooltip/PermissionTooltip.tsx';
import UserInfoPopover from '~v5/shared/UserInfoPopover/UserInfoPopover.tsx';

import { type MemberCardProps } from './types.ts';

const displayName = 'v5.common.MemberCard';

const MemberCard: FC<MemberCardProps> = ({
  userAddress,
  user,
  domains,
  meatBallMenuProps,
  reputation,
  contributorType,
  isVerified,
}) => {
  const { header, start, end } = splitAddress(userAddress);
  const userName = user?.profile?.displayName || `${header}${start}...${end}`;

  const { isMultiSigEnabled } = useEnabledExtensions();
  const selectedDomain = useGetSelectedDomainFilter();

  const contributorRootDomain = domains.find(
    ({ nativeId }) => nativeId === Id.RootDomain,
  );

  const isRootDomain =
    !selectedDomain || selectedDomain.nativeId === Id.RootDomain;

  const contributorDomain = isRootDomain
    ? contributorRootDomain
    : domains.find(({ nativeId }) => nativeId === selectedDomain?.nativeId);

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
          className="flex w-full max-w-full flex-grow flex-col items-center justify-between gap-2 text-gray-900"
        >
          <ContributorTypeWrapper contributorType={contributorType}>
            <UserAvatar
              userAvatarSrc={user?.profile?.avatar ?? undefined}
              userName={user?.profile?.displayName ?? undefined}
              userAddress={userAddress}
              size={60}
            />
          </ContributorTypeWrapper>
          <div className="flex max-w-full items-center justify-center text-center text-1">
            <p className="min-w-0 flex-1 truncate">{userName}</p>
            {isVerified && (
              <SealCheck
                size={14}
                className="ml-1 flex-shrink-0 text-blue-400"
              />
            )}
          </div>
        </UserInfoPopover>
        <div className="absolute right-0 top-0">
          <MeatBallMenu withVerticalIcon {...meatBallMenuProps} />
        </div>
      </div>
      <div className="mt-[.6875rem] flex w-full items-center justify-between border-t border-t-gray-200 pt-[.6875rem]">
        <ReputationBadge
          className="min-h-[1.625rem] min-w-[4.25rem]"
          reputation={reputation || 0}
        />
        <div className="flex w-full justify-end gap-1 @container/cardDetails">
          <PermissionTooltip
            userPermissionsInDomain={contributorDomain?.permissions || []}
            userPermissionsInParentDomain={
              contributorRootDomain?.permissions || []
            }
            isRootDomain={isRootDomain}
            showRoleLabel
          />
          {isMultiSigEnabled && (
            <PermissionTooltip
              userPermissionsInDomain={
                contributorDomain?.multiSigPermissions || []
              }
              userPermissionsInParentDomain={
                contributorRootDomain?.multiSigPermissions || []
              }
              isRootDomain={isRootDomain}
              isMultiSig
              showRoleLabel
            />
          )}
        </div>
      </div>
    </div>
  );
};

MemberCard.displayName = displayName;

export default MemberCard;
