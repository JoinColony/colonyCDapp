import React, { type FC } from 'react';

import useUserByAddress from '~hooks/useUserByAddress.ts';
import UserAvatar from '~v5/shared/UserAvatar/UserAvatar.tsx';

const displayName =
  'pages.StreamingPaymentsPage.partials.StreamingPaymentsTable.partials.UserField';

interface UserFieldProps {
  address: string;
  isLoading: boolean;
}

const UserField: FC<UserFieldProps> = ({ address, isLoading }) => {
  const { user, loading: isUserLoading } = useUserByAddress(address, true);

  return isUserLoading || isLoading ? (
    <div className="flex items-center gap-4">
      <div className="h-6 w-6 overflow-hidden rounded-full skeleton" />
      <div className="h-5 w-1/4 overflow-hidden skeleton" />
    </div>
  ) : (
    <div className="flex items-center gap-4">
      <UserAvatar
        size={24}
        userAvatarSrc={user?.profile?.avatar ?? undefined}
        userName={user?.profile?.displayName ?? undefined}
        userAddress={user?.walletAddress || ''}
      />
      <span className="text-1">
        {user?.profile?.displayName || user?.walletAddress}
      </span>
    </div>
  );
};

UserField.displayName = displayName;

export default UserField;
