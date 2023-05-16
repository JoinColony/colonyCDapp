import React, { FC } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';
import { UserMenuProps } from './types';
import { useAppContext, useMobile } from '~hooks';
import Button from '~shared/Extensions/Button';
import Link from '~shared/Link';
import Icon from '~shared/Icon';
import ThemeSwitcher from '~common/Extensions/ThemeSwitcher';
import styles from './UserMenu.module.css';
import PopoverBase from '~shared/Extensions/PopoverBase';
import TitledContent from '~common/Extensions/TitledContent/TitledContent';
import Avatar from '~shared/Extensions/Avatar';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import Token from '../Token';
import UserAvatar from '~shared/Extensions/UserAvatar';
import MemberReputation from '../MemberReputation';

const displayName = 'common.Extensions.UserNavigation.partials.UserMenu';

const UserMenu: FC<UserMenuProps> = ({
  tooltipProps,
  setTooltipRef,
  isWalletConnected,
  userName,
  isVerified,
  walletAddress,
  copyUrl,
  userReputation,
  totalReputation,
  nativeToken,
}) => {
  const isMobile = useMobile();
  const { formatMessage } = useIntl();
  const { connectWallet } = useAppContext();
  const { handleClipboardCopy } = useCopyToClipboard(walletAddress || '');

  return (
    <PopoverBase
      setTooltipRef={setTooltipRef}
      tooltipProps={tooltipProps}
      classNames={clsx('px-0 md:px-6 py-6 flex justify-start z-[9999] tooltip-container', {
        'w-full border-none shadow-none': isMobile,
        'w-[20.125rem]': !isMobile,
        'h-[32rem] md:h-[23rem]': !isWalletConnected,
        'md:h-[31.5rem]': isWalletConnected,
      })}
    >
      {isWalletConnected ? (
        <div>
          <div className={styles.mobileButtons}>
            {nativeToken && <Token nativeToken={nativeToken} />}
            <Button mode="tertiaryOutline" isFullRounded>
              <div className="flex items-center gap-3">
                <UserAvatar userName="panda" size="xxs" isLink={false} />
                <MemberReputation
                  userReputation={userReputation}
                  totalReputation={totalReputation}
                  hideOnMobile={false}
                />
              </div>
            </Button>
            <Button mode="tertiaryOutline" isFullRounded>
              <Icon name="list" appearance={{ size: 'extraTiny' }} />
              <p className="text-sm font-inter font-medium ml-1">{formatMessage({ id: 'helpAndAccount' })}</p>
            </Button>
          </div>
          <div className="w-full pb-6 mb-6 border-b border-b-gray-200 md:pb-5 md:mb-5">
            <div className="grid grid-cols-[auto,1fr] gap-x-4 items-center mb-6">
              <Avatar size="m" title={userName ?? ''} />
              <div>
                <div className="flex items-center mb-0.5">
                  <p className="text-gray-900 font-semibold text-xl">{userName}</p>
                  {isVerified && (
                    <span className="ml-2 flex shrink-0 [&_svg]:text-blue-400">
                      <Icon name="verified" appearance={{ size: 'tiny' }} />
                    </span>
                  )}
                </div>
                {copyUrl ? (
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
                      <span>{isMobile ? formatMessage({ id: 'copyWalletAddress' }) : walletAddress}</span>
                      <span className={clsx('flex shrink-0', isMobile ? 'mr-1.5' : 'ml-1.5')}>
                        <Icon name="copy-simple" appearance={{ size: 'extraTiny' }} />
                      </span>
                    </span>
                  </button>
                ) : (
                  <p className="text-sm">{walletAddress}</p>
                )}
              </div>
            </div>
            <Link to="/" className="flex items-center">
              <Icon name="user-circle-gear" appearance={{ size: 'tiny' }} />
              <p className="ml-2 text-lg font-semibold md:font-normal md:text-md text-gray-900">
                {formatMessage({ id: 'userMenu.menageTitle' })}
              </p>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.mobileButtons}>
            <Button mode="tertiaryOutline" isFullRounded>
              <Icon name="cardholder" appearance={{ size: 'tiny' }} />
              <p className="text-sm font-inter font-medium ml-1">{formatMessage({ id: 'connectWallet' })}</p>
            </Button>
            <Button mode="tertiaryOutline" isFullRounded>
              <Icon name="list" appearance={{ size: 'extraTiny' }} />
              <p className="text-sm font-inter font-medium ml-1">{formatMessage({ id: 'help' })}</p>
            </Button>
          </div>
          <div className="w-full pb-6 mb-6 border-b border-b-gray-200 md:pb-5 md:mb-5">
            <Button mode="quaternaryOutline" isFullSize onClick={connectWallet}>
              {formatMessage({ id: 'connectWallet' })}
            </Button>
          </div>
        </>
      )}
      <div className="w-full pb-6 mb-6 border-b border-b-gray-200 md:pb-5 md:mb-5">
        <TitledContent title={formatMessage({ id: 'userMenu.optionsTitle' })}>
          <ul className="text-lg font-semibold md:font-normal md:text-md text-gray-900">
            <li className="mb-4">
              <Link to="/" className="flex items-center">
                <Icon name="circles-three-plus" appearance={{ size: 'tiny' }} />
                <p className="ml-2">{formatMessage({ id: 'userMenu.getStartedTitle' })}</p>
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/" className="flex items-center">
                <Icon name="lifebuoy" appearance={{ size: 'tiny' }} />
                <p className="ml-2">{formatMessage({ id: 'userMenu.contactAndSupportTitle' })}</p>
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/" className="flex items-center">
                <Icon name="code" appearance={{ size: 'tiny' }} />
                <p className="ml-2">{formatMessage({ id: 'userMenu.developersTitle' })}</p>
              </Link>
            </li>
            <li>
              <Link to="/" className="flex items-center">
                <Icon name="briefcase" appearance={{ size: 'tiny' }} />
                <p className="ml-2">{formatMessage({ id: 'userMenu.legalAndPrivacyTitle' })}</p>
              </Link>
            </li>
          </ul>
        </TitledContent>
      </div>
      {isWalletConnected && (
        <div className="w-full mb-6 md:mb-5">
          <TitledContent title={formatMessage({ id: 'userMenu.other' })}>
            <Link to="/" className="flex items-center text-lg font-semibold md:font-normal md:text-md text-gray-900">
              <Icon name="plugs" appearance={{ size: 'tiny' }} />
              <p className="ml-2">{formatMessage({ id: 'userMenu.disconnectWalletTitle' })}</p>
            </Link>
          </TitledContent>
        </div>
      )}
      <ThemeSwitcher />
    </PopoverBase>
  );
};

UserMenu.displayName = displayName;

export default UserMenu;
