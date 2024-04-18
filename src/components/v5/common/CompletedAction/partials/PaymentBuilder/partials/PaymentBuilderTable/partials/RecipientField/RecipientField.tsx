import { WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import UserAvatar from '~v5/shared/UserAvatar/UserAvatar.tsx';
import UserPopover from '~v5/shared/UserPopover/UserPopover.tsx';

import { type RecipientFieldProps } from './types.ts';

const RecipientField: FC<RecipientFieldProps> = ({ address }) => {
  const { totalMembers, loading } = useMemberContext();
  const recipientMember = totalMembers.find(
    (member) => member.contributorAddress === address,
  );

  return !loading ? (
    <div className="flex w-full items-center">
      <UserPopover
        user={recipientMember?.user}
        walletAddress={recipientMember?.contributorAddress || address}
        withVerifiedBadge={recipientMember?.isVerified}
        className={clsx('flex w-full items-center sm:hover:text-blue-400', {
          'pointer-events-none': loading,
          'text-warning-400': !recipientMember?.isVerified,
          'text-gray-900': recipientMember?.isVerified,
        })}
      >
        <UserAvatar
          user={recipientMember?.user || address}
          avatar={
            recipientMember?.user?.profile?.thumbnail ||
            recipientMember?.user?.profile?.avatar
          }
          showUsername
          size="xs"
          className={clsx({
            'skeleton before:rounded-full': loading,
          })}
        />
        {!recipientMember?.isVerified && (
          <span className="ml-1">
            <WarningCircle size={14} className="text-warning-400" />
          </span>
        )}
      </UserPopover>
    </div>
  ) : null;
};

export default RecipientField;
