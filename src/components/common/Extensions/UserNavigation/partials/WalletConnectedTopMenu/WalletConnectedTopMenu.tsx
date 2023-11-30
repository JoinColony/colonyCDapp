import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import Link from '~v5/shared/Link';
import Icon from '~shared/Icon';
import { useMobile } from '~hooks';
import UserAvatarDetails from '~v5/shared/UserAvatarDetails';
import { USER_HOME_ROUTE, USER_EDIT_PROFILE_ROUTE } from '~routes';
import { UserAvatarDetailsProps } from '~v5/shared/UserAvatarDetails/types';

const displayName =
  'common.Extensions.UserNavigation.partials.WalletConnectedTopMenu';

const WalletConnectedTopMenu: FC<UserAvatarDetailsProps> = ({
  isVerified,
  userName,
  walletAddress,
  avatar,
}) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  const iconSize = isMobile ? 'small' : 'extraSmall';

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
      <Link
        to={`${USER_HOME_ROUTE}/${USER_EDIT_PROFILE_ROUTE}`}
        className="navigation-link hover:bg-gray-50 rounded -ml-4 w-[calc(100%+2rem)]"
      >
        <Icon name="user-circle-gear" appearance={{ size: iconSize }} />
        <p className="ml-2">{formatMessage({ id: 'userMenu.menageTitle' })}</p>
      </Link>
    </div>
  );
};

WalletConnectedTopMenu.displayName = displayName;

export default WalletConnectedTopMenu;
