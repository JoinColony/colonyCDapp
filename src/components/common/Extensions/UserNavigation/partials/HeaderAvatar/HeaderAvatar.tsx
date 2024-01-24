import React from 'react';

import { useAppContext } from '~context/AppContext';
import UserAvatar from '~v5/shared/UserAvatar';

export const displayName =
  'common.Extensions.UserNavigation.partials.HeaderAvatar';

const HeaderAvatar = () => {
  const { wallet, user } = useAppContext();

  // Prevent content flashes
  if (!wallet) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-w-[2.625rem] min-h-[2.5rem] px-[0.875rem] py-[0.625rem] bg-base-white border rounded-full border-gray-200">
      <UserAvatar user={user || wallet?.address} showUsername size="xxs" />
    </div>
  );
};

HeaderAvatar.displayName = displayName;

export default HeaderAvatar;
