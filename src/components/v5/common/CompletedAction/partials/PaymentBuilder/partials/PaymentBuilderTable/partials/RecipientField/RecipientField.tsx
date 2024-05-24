import clsx from 'clsx';
import React, { type FC } from 'react';

import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import UserPopover from '~v5/shared/UserPopover/UserPopover.tsx';

import { type RecipientFieldProps } from './types.ts';

const RecipientField: FC<RecipientFieldProps> = ({ address, isLoading }) => {
  const { totalMembers, loading } = useMemberContext();
  const recipientMember = totalMembers.find(
    (member) => member.contributorAddress === address,
  );

  return (
    <>
      {!loading && !isLoading ? (
        <div className="flex items-center">
          <UserPopover
            size={18}
            walletAddress={
              recipientMember ? recipientMember.contributorAddress : address
            }
            withVerifiedBadge={!!recipientMember?.isVerified}
            className={clsx('flex items-center sm:hover:text-blue-400', {
              'pointer-events-none': loading,
              'text-warning-400': !recipientMember?.isVerified,
              'text-gray-900': recipientMember?.isVerified,
            })}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="h-[1.125rem] w-[1.125rem] overflow-hidden rounded-full skeleton" />
          <div className="h-4 w-16 overflow-hidden rounded skeleton" />
        </div>
      )}
    </>
  );
};

export default RecipientField;
