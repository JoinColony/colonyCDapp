import React, { FC } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';

import styles from './WalletConnectedTopMenu.module.css';
import Button from '~shared/Extensions/Button';
import Link from '~shared/Extensions/Link';
import Icon from '~shared/Extensions/Icon';
import Avatar from '~shared/Extensions/Avatar';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import Token from '../Token';
import UserAvatar from '~shared/Extensions/UserAvatar';
import MemberReputation from '../MemberReputation';
import { WalletConnectedTopMenuProps } from './types';
import { useMobile } from '~hooks';
import { splitWalletAddress } from '~utils/splitWalletAddress';

const displayName = 'common.Extensions.UserNavigation.partials.WalletConnectedTopMenu';

const WalletConnectedTopMenu: FC<WalletConnectedTopMenuProps> = ({
  isVerified,
  nativeToken,
  totalReputation,
  userName = '',
  userReputation,
  walletAddress,
  avatar,
  user,
}) => {
  const isMobile = useMobile();
  const { handleClipboardCopy } = useCopyToClipboard(walletAddress || '');
  const { formatMessage } = useIntl();

  return (
    <>
      <div className={styles.mobileButtons}>
        {nativeToken && <Token nativeToken={nativeToken} />}
        <Button mode="tertiaryOutline" isFullRounded>
          <div className="flex items-center gap-3">
            <UserAvatar userName={userName} size="xxs" user={user} />
            <MemberReputation userReputation={userReputation} totalReputation={totalReputation} hideOnMobile={false} />
          </div>
        </Button>
        <Button mode="tertiaryOutline" isFullRounded>
          <Icon name="list" appearance={{ size: 'extraTiny' }} />
          <p className="text-sm font-inter font-medium ml-1">{formatMessage({ id: 'helpAndAccount' })}</p>
        </Button>
      </div>
      <div className="w-full pb-6 mb-6 border-b border-b-gray-200 md:pb-5 md:mb-5">
        <div className="grid grid-cols-[auto,1fr] gap-x-4 items-center mb-6">
          <Avatar size="m" title={userName} avatar={avatar} />
          <div>
            <div className="flex items-center mb-0.5">
              <p className="text-gray-900 font-semibold text-xl">{userName}</p>
              {isVerified && (
                <span className="ml-2 flex shrink-0 [&_svg]:text-blue-400">
                  <Icon name="verified" appearance={{ size: 'tiny' }} />
                </span>
              )}
            </div>
            <button
              onClick={handleClipboardCopy}
              onKeyDown={handleClipboardCopy}
              type="button"
              aria-label={formatMessage({ id: 'copyWalletAddress' })}
              className={clsx(
                'flex items-center transition-all duration-normal hover:text-blue-400',
                isMobile
                  ? `border border-gray-100 rounded-[0.1875rem] w-full px-1.5 py-1 justify-center text-gray-700 text-xs mt-1.5`
                  : 'text-sm text-gray-600',
              )}
            >
              <span className={clsx('flex items-center', isMobile ? 'flex-row-reverse' : 'flex')}>
                <span>
                  {isMobile ? formatMessage({ id: 'copyWalletAddress' }) : splitWalletAddress(walletAddress || '')}
                </span>
                <span className={clsx('flex shrink-0', isMobile ? 'mr-1.5' : 'ml-1.5')}>
                  <Icon name="copy-simple" appearance={{ size: 'extraTiny' }} />
                </span>
              </span>
            </button>
          </div>
        </div>
        <Link to="/" className="flex items-center">
          <Icon name="user-circle-gear" appearance={{ size: 'tiny' }} />
          <p className="ml-2 text-lg font-semibold md:font-normal md:text-md">
            {formatMessage({ id: 'userMenu.menageTitle' })}
          </p>
        </Link>
      </div>
    </>
  );
};

WalletConnectedTopMenu.displayName = displayName;

export default WalletConnectedTopMenu;
