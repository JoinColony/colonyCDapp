import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import Link from '~v5/shared/Link';
import Icon from '~shared/Icon';
import { WalletConnectedTopMenuProps } from './types';
import NavigationTools from '~common/Extensions/NavigationTools';
import { useMobile } from '~hooks';
import UserAvatarDetails from '~v5/shared/UserAvatarDetails';

const displayName =
  'common.Extensions.UserNavigation.partials.WalletConnectedTopMenu';

const WalletConnectedTopMenu: FC<WalletConnectedTopMenuProps> = ({
  isVerified,
  nativeToken,
  totalReputation,
  userName,
  userReputation,
  walletAddress,
  avatar,
  user,
}) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  const iconSize = isMobile ? 'small' : 'extraSmall';

  return (
    <>
      <div className="w-full pb-6 mb-6 border-b border-b-gray-200 flex sm:hidden items-center gap-1 md:pb-5 md:mb-5">
        <NavigationTools
          nativeToken={nativeToken}
          totalReputation={totalReputation}
          userName={userName}
          userReputation={userReputation}
          user={user}
        />
      </div>
      <div className="w-full pb-4 mb-6 border-b border-b-gray-200 sm:pb-3 sm:mb-5">
        <div className="mb-4 sm:mb-2">
          <UserAvatarDetails
            userName={userName}
            walletAddress={walletAddress}
            avatar={avatar}
            isVerified={isVerified}
          />
        </div>
        <Link to="/" className="navigation-link">
          <Icon name="user-circle-gear" appearance={{ size: iconSize }} />
          <p className="ml-2">
            {formatMessage({ id: 'userMenu.menageTitle' })}
          </p>
        </Link>
      </div>
    </>
  );
};

WalletConnectedTopMenu.displayName = displayName;

export default WalletConnectedTopMenu;
