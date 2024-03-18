import { SealCheck } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import UserAvatar from '~v5/shared/UserAvatar/UserAvatar.tsx';

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
          <UserAvatar
            user={recipientMember?.user}
            size="xs"
            showUsername
            className={clsx({
              'text-warning-400': !recipientMember?.isVerified,
            })}
          />
          {recipientMember?.isVerified && (
            <span className="ml-2 flex text-blue-400">
              <SealCheck size={20} />
            </span>
          )}
        </div>
      )}
    </>
  );
};

export default RecipientField;
