import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import Link from '~v5/shared/Link';
import Icon from '~shared/Icon';
import Avatar from '~v5/shared/Avatar';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import { WalletConnectedTopMenuProps } from './types';
import NavigationTools from '~common/Extensions/NavigationTools';
import CopyWalletAddressButton from '~v5/shared/CopyWalletAddressButton';

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
  const { handleClipboardCopy } = useCopyToClipboard(walletAddress || '');
  const { formatMessage } = useIntl();

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
      <div className="w-full pb-6 mb-6 border-b border-b-gray-200 sm:pb-5 sm:mb-5">
        <div className="grid grid-cols-[auto,1fr] gap-x-4 items-center mb-6">
          <Avatar size="m" title={userName} avatar={avatar} />
          <div>
            <div className="flex items-center mb-0.5">
              <p className="heading-4">{userName}</p>
              {isVerified && (
                <span className="ml-2 flex shrink-0 text-blue-400">
                  <Icon name="verified" appearance={{ size: 'tiny' }} />
                </span>
              )}
            </div>
            <CopyWalletAddressButton
              handleClipboardCopy={handleClipboardCopy}
              walletAddress={walletAddress || ''}
            />
          </div>
        </div>
        <Link to="/" className="flex items-center">
          <Icon name="user-circle-gear" appearance={{ size: 'tiny' }} />
          <p className="ml-2 heading-5 sm:font-normal sm:text-md">
            {formatMessage({ id: 'userMenu.menageTitle' })}
          </p>
        </Link>
      </div>
    </>
  );
};

WalletConnectedTopMenu.displayName = displayName;

export default WalletConnectedTopMenu;
