import { WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { useMemberContext } from '~context/MemberContext.tsx';
import Avatar from '~shared/Avatar/index.ts';
import UserPopover from '~v5/shared/UserPopover/index.ts';

import { type RecipientFieldProps } from './types.ts';

const RecipientField: FC<RecipientFieldProps> = ({ address }) => {
  const { totalMembers, loading } = useMemberContext();
  const selectedUser = totalMembers.find(
    (member) => member.contributorAddress === address,
  );

  return (
    <>
      {!loading && selectedUser?.user && (
        <div className="flex items-center">
          <UserPopover
            user={selectedUser.user}
            walletAddress={selectedUser.contributorAddress}
            withVerifiedBadge={selectedUser.isVerified}
            className={clsx('flex items-center sm:hover:text-blue-400', {
              'pointer-events-none': loading,
              'text-warning-400': !selectedUser?.isVerified,
              'text-gray-900': selectedUser?.isVerified,
            })}
          >
            <Avatar
              seed={selectedUser.contributorAddress?.toLowerCase()}
              title={
                selectedUser.user?.profile?.displayName ||
                selectedUser.contributorAddress
              }
              avatar={
                selectedUser.user?.profile?.thumbnail ||
                selectedUser.user?.profile?.avatar
              }
              size="xxs"
              className={clsx({
                'skeleton before:rounded-full': loading,
              })}
            />
            <p
              className={clsx('ml-2 text-md inline-block', {
                skeleton: loading,
              })}
            >
              {loading
                ? 'Loading...'
                : selectedUser.user?.profile?.displayName ||
                  selectedUser.contributorAddress}
            </p>
            {!selectedUser?.isVerified && (
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
