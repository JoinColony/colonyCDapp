import { WarningCircle } from '@phosphor-icons/react';
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
      {!loading && recipientMember?.user && (
        <div className="flex items-center">
          <UserPopover
            size={18}
            walletAddress={recipientMember.contributorAddress}
            withVerifiedBadge={recipientMember.isVerified}
            className={clsx('flex items-center sm:hover:text-blue-400', {
              'pointer-events-none': loading,
              'text-warning-400': !recipientMember?.isVerified,
              'text-gray-900': recipientMember?.isVerified,
            })}
            additionalContent={
              !recipientMember?.isVerified ? (
                <span className="ml-1">
                  <WarningCircle size={14} className="text-warning-400" />
                </span>
              ) : undefined
            }
          />
        </div>
      )}
    </>
  );
};

export default RecipientField;
