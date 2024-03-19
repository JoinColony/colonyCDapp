import { WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import Avatar from '~shared/Avatar/Avatar.tsx';
import UserPopover from '~v5/shared/UserPopover/UserPopover.tsx';

import { type RecipientFieldProps } from './types.ts';

const RecipientField: FC<RecipientFieldProps> = ({ address }) => {
  const { totalMembers, loading } = useMemberContext();
  const recipientMember = totalMembers.find(
    (member) => member.contributorAddress === address,
  );

  return (
    <>
      {!loading && recipientMember?.user && (
        <div className="flex items-center">
          <UserPopover
            user={recipientMember.user}
            walletAddress={recipientMember.contributorAddress}
            withVerifiedBadge={recipientMember.isVerified}
            className={clsx('flex items-center sm:hover:text-blue-400', {
              'pointer-events-none': loading,
              'text-warning-400': !recipientMember?.isVerified,
              'text-gray-900': recipientMember?.isVerified,
            })}
          >
            <Avatar
              seed={recipientMember.contributorAddress?.toLowerCase()}
              title={
                recipientMember.user?.profile?.displayName ||
                recipientMember.contributorAddress
              }
              avatar={
                recipientMember.user?.profile?.thumbnail ||
                recipientMember.user?.profile?.avatar
              }
              size="xxs"
              className={clsx({
                'skeleton before:rounded-full': loading,
              })}
            />
            <p
              className={clsx('ml-2 inline-block text-md', {
                skeleton: loading,
              })}
            >
              {loading
                ? 'Loading...'
                : recipientMember.user?.profile?.displayName ||
                  recipientMember.contributorAddress}
            </p>
            {!recipientMember?.isVerified && (
              <span className="ml-1">
                <WarningCircle size={14} className="text-warning-400" />
              </span>
            )}
          </UserPopover>
        </div>
      )}
    </>
  );
};

export default RecipientField;
