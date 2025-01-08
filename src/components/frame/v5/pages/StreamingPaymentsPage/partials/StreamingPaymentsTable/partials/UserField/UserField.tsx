import React, { type FC } from 'react';

import useUserByAddress from '~hooks/useUserByAddress.ts';
import UserAvatar from '~v5/shared/UserAvatar/UserAvatar.tsx';

const displayName =
  'pages.StreamingPaymentsPage.partials.StreamingPaymentsTable.partials.UserField';

interface UserFieldProps {
  address: string;
  isLoading: boolean;
  toggleExpanded: (expanded?: boolean | undefined) => void;
}

const UserField: FC<UserFieldProps> = ({
  address,
  isLoading,
  toggleExpanded,
}) => {
  const { user, loading: isUserLoading } = useUserByAddress(address, true);

  return isUserLoading || isLoading ? (
    <div className="flex items-center gap-4 pl-[1.125rem]">
      <div className="h-6 w-6 overflow-hidden rounded-full skeleton" />
      <div className="h-5 w-1/4 overflow-hidden skeleton" />
    </div>
  ) : (
    <button
      type="button"
      className="flex h-full w-full items-center gap-4 pl-[1.125rem] pr-4"
      onClick={() => toggleExpanded()}
    >
      <UserAvatar
        size={24}
        userAvatarSrc={user?.profile?.avatar ?? undefined}
        userName={user?.profile?.displayName ?? undefined}
        userAddress={user?.walletAddress || ''}
      />
      <span className="text-1">
        {user?.profile?.displayName || user?.walletAddress}
      </span>
    </button>
  );
};

UserField.displayName = displayName;

export default UserField;
