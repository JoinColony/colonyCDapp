import { SealCheck } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { useMemberContext } from '~context/MemberContext.tsx';
import UserAvatar from '~v5/shared/UserAvatar/UserAvatar.tsx';

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
          <UserAvatar
            user={selectedUser?.user}
            size="xs"
            showUsername
            className={clsx({
              'text-warning-400': !selectedUser?.isVerified,
            })}
          />
          {selectedUser?.isVerified && (
            <span className="flex ml-2 text-blue-400">
              <SealCheck size={20} />
            </span>
          )}
        </div>
      )}
    </>
  );
};

export default RecipientField;
