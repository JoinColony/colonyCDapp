import { WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import useUserByAddress from '~hooks/useUserByAddress.ts';
import UserAvatar from '~v5/shared/UserAvatar/UserAvatar.tsx';
import UserPopover from '~v5/shared/UserPopover/UserPopover.tsx';

import { type RecipientFieldProps } from './types.ts';

const RecipientField: FC<RecipientFieldProps> = ({ address, isLoading }) => {
  const { totalMembers, loading } = useMemberContext();
  const recipientMember = totalMembers.find(
    (member) => member.contributorAddress === address,
  );

  const { user: userByAddress, loading: userByAddressLoading } =
    useUserByAddress(address);
  const { profile } = userByAddress || {};

  return !loading && !isLoading ? (
    <div className="flex w-full items-center">
      <UserPopover
        user={recipientMember?.user || userByAddress}
        userName={
          recipientMember?.user?.profile?.displayName || profile?.displayName
        }
        walletAddress={recipientMember?.contributorAddress || address}
        withVerifiedBadge={recipientMember?.isVerified}
        className={clsx('flex w-full items-center sm:hover:text-blue-400', {
          'pointer-events-none': loading || userByAddressLoading,
          'text-warning-400': !recipientMember?.isVerified,
          'text-gray-900': recipientMember?.isVerified,
        })}
      >
        <UserAvatar
          user={recipientMember?.user || userByAddress || address}
          avatar={
            recipientMember?.user?.profile?.thumbnail ||
            recipientMember?.user?.profile?.avatar ||
            profile?.thumbnail ||
            profile?.avatar
          }
          showUsername
          size="xs"
          className={clsx({
            'skeleton before:rounded-full': loading || userByAddressLoading,
          })}
        />
        {!recipientMember?.isVerified && (
          <span className="ml-1">
            <WarningCircle size={14} className="text-warning-400" />
          </span>
        )}
      </UserPopover>
    </div>
  ) : (
    <div className="flex w-[11.25rem] items-center">
      <div className="mr-2 h-5 w-5 overflow-hidden rounded-full skeleton" />
      <div className="h-4 w-1/2 overflow-hidden rounded skeleton" />
    </div>
  );
};

export default RecipientField;
