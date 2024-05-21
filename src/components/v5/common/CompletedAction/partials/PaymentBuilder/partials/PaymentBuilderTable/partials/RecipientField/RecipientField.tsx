import clsx from 'clsx';
import React, { type FC } from 'react';

import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import UserPopover from '~v5/shared/UserPopover/UserPopover.tsx';

import { type RecipientFieldProps } from './types.ts';

const RecipientField: FC<RecipientFieldProps> = ({ address }) => {
  const { totalMembers, loading } = useMemberContext();
  const recipientMember = totalMembers.find(
    (member) => member.contributorAddress === address,
  );

  return (
    <>
      {!loading && (
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
      )}
    </>
  );
};

export default RecipientField;
