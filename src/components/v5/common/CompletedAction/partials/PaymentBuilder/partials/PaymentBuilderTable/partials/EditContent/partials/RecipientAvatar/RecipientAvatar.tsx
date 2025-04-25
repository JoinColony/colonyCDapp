import clsx from 'clsx';
import React, { type FC } from 'react';

import useUserByAddress from '~hooks/useUserByAddress.ts';
import UserAvatar from '~v5/shared/UserAvatar/UserAvatar.tsx';

interface RecipientAvatarProps {
  userAddress: string;
  isNew: boolean;
}

const RecipientAvatar: FC<RecipientAvatarProps> = ({ userAddress, isNew }) => {
  const { user: userByAddress } = useUserByAddress(userAddress);

  return userAddress ? (
    <div className="flex items-center gap-2">
      <UserAvatar
        userAddress={userByAddress?.walletAddress || ''}
        userAvatarSrc={userByAddress?.profile?.avatar || ''}
        size={18}
      />
      <p
        className={clsx('text-3', {
          'text-blue-400': isNew,
          'text-gray-900': !isNew,
        })}
      >
        {userByAddress?.profile?.displayName}
      </p>
    </div>
  ) : (
    <p className="text-3">-</p>
  );
};

export default RecipientAvatar;
