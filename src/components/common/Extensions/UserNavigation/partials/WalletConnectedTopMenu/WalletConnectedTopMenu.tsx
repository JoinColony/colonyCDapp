import { UserCircleGear } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import { useAppContext } from '~context/AppContext.tsx';
import { useMobile } from '~hooks/index.ts';
import {
  USER_HOME_ROUTE,
  USER_EDIT_PROFILE_ROUTE,
  CREATE_PROFILE_ROUTE,
} from '~routes/index.ts';
import Link from '~v5/shared/Link/index.ts';
import UserAvatarDetails from '~v5/shared/UserAvatarDetails/index.ts';
import { type UserAvatarDetailsProps } from '~v5/shared/UserAvatarDetails/types.ts';

const displayName =
  'common.Extensions.UserNavigation.partials.WalletConnectedTopMenu';

const WalletConnectedTopMenu: FC<UserAvatarDetailsProps> = ({
  isVerified,
  userName,
  walletAddress,
  avatar,
}) => {
  const { formatMessage } = useIntl();
  const { user } = useAppContext();
  const isMobile = useMobile();

  const iconSize = isMobile ? 18 : 16;

  return (
    <div className="w-full pb-4 mb-6 border-b border-b-gray-200 sm:pb-3 sm:mb-5">
      <div className="mb-4 sm:mb-2">
        <UserAvatarDetails
          userName={userName}
          walletAddress={walletAddress}
          avatar={avatar}
          isVerified={isVerified}
        />
      </div>
      {user ? (
        <Link
          to={`${USER_HOME_ROUTE}/${USER_EDIT_PROFILE_ROUTE}`}
          className="navigation-link hover:bg-gray-50 rounded -ml-4 w-[calc(100%+2rem)]"
        >
          <UserCircleGear size={iconSize} />
          <p className="ml-2">
            {formatMessage({ id: 'userMenu.manageTitle' })}
          </p>
        </Link>
      ) : (
        <Link
          to={CREATE_PROFILE_ROUTE}
          className="navigation-link hover:bg-gray-50 rounded -ml-4 w-[calc(100%+2rem)]"
        >
          <UserCircleGear size={iconSize} />
          <p className="ml-2">
            {formatMessage({ id: 'userMenu.createTitle' })}
          </p>
        </Link>
      )}
    </div>
  );
};

WalletConnectedTopMenu.displayName = displayName;

export default WalletConnectedTopMenu;
