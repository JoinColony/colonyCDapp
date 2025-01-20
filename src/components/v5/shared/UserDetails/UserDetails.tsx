import { SealCheck } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import CopyableAddress from '~v5/shared/CopyableAddress/index.ts';

import ContributorTypeWrapper from '../ContributorTypeWrapper/ContributorTypeWrapper.tsx';
import { UserAvatar } from '../UserAvatar/UserAvatar.tsx';

import { type UserDetailsProps } from './types.ts';

const displayName = 'v5.UserDetails';

const UserDetails: FC<UserDetailsProps> = ({
  userName,
  walletAddress,
  contributorType,
  isVerified,
  userAvatarSrc,
}) => {
  return (
    <div className="grid grid-cols-[auto,1fr] items-center gap-x-4">
      <div className="relative flex justify-center">
        <ContributorTypeWrapper contributorType={contributorType}>
          <UserAvatar
            size={70}
            userAvatarSrc={userAvatarSrc}
            userName={userName ?? undefined}
            userAddress={walletAddress}
          />
        </ContributorTypeWrapper>
      </div>
      <div>
        <div className="mb-0.5 grid grid-cols-[auto,1fr] items-center gap-x-2">
          <p className="truncate heading-4">{userName || walletAddress}</p>
          {isVerified && (
            <span className="flex shrink-0 text-blue-400">
              <SealCheck size={14} />
            </span>
          )}
        </div>
        <div className="py-1">
          {walletAddress && <CopyableAddress address={walletAddress} />}
        </div>
      </div>
    </div>
  );
};

UserDetails.displayName = displayName;

export default UserDetails;
