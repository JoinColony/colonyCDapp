import React from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useMobile } from '~hooks';
import { splitWalletAddress } from '~utils/splitWalletAddress.ts';
import UserAvatar from '~v5/shared/UserAvatar/index.ts';

const displayName = 'common.Extensions.UserNavigation.partials.HeaderAvatar';

const HeaderAvatar = () => {
  const { wallet, user } = useAppContext();
  const isMobile = useMobile();

  // Prevent content flashes
  if (!wallet) {
    return null;
  }

  const userName =
    user?.profile?.displayName ?? splitWalletAddress(wallet.address);

  return (
    <div className="flex min-h-[2.5rem] min-w-[2.625rem] items-center justify-center rounded-full border border-gray-200 bg-base-white px-[0.875rem] py-[0.625rem]">
      <UserAvatar
        userAvatarSrc={user?.profile?.avatar ?? undefined}
        userName={userName}
        userAddress={wallet.address}
        size={isMobile ? 18 : 16}
        testId="header-avatar"
      />
      {!isMobile && (
        <p className="ml-1 truncate text-sm font-medium">{userName}</p>
      )}
    </div>
  );
};

HeaderAvatar.displayName = displayName;

export default HeaderAvatar;
