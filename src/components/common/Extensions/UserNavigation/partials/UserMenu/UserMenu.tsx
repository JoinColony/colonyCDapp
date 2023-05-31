import React, { FC } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';

import { UserMenuProps } from './types';
import { useAppContext, useMobile } from '~hooks';
import Button from '~shared/Extensions/Button';
import Icon from '~shared/Extensions/Icon';
import ThemeSwitcher from '~common/Extensions/ThemeSwitcher';
import styles from './UserMenu.module.css';
import PopoverBase from '~shared/Extensions/PopoverBase';
import TitledContent from '~common/Extensions/TitledContent/TitledContent';
import WalletConnectedTopMenu from '../WalletConnectedTopMenu/WalletConnectedTopMenu';
import Link from '~shared/Extensions/Link';

const displayName = 'common.Extensions.UserNavigation.partials.UserMenu';

const UserMenu: FC<UserMenuProps> = ({
  tooltipProps,
  setTooltipRef,
  isWalletConnected,
  user,
  isVerified,
  walletAddress,
  userReputation,
  totalReputation,
  nativeToken,
}) => {
  const isMobile = useMobile();
  const { formatMessage } = useIntl();
  const { connectWallet } = useAppContext();
  const { name, profile } = user || {};

  const iconSize = isMobile ? 'small' : 'extraTiny';

  return (
    <PopoverBase
      setTooltipRef={setTooltipRef}
      tooltipProps={tooltipProps}
      classNames={clsx('p-6 rounded-lg flex border-gray-100 justify-start z-[9999] tooltip-container', {
        'w-full border-none shadow-none': isMobile,
        'w-[20.125rem]': !isMobile,
        'h-[32rem] md:h-[23rem]': !isWalletConnected,
        'md:h-[29rem]': isWalletConnected,
      })}
    >
      {isWalletConnected ? (
        <WalletConnectedTopMenu
          userName={profile?.displayName || name}
          isVerified={isVerified}
          walletAddress={walletAddress}
          userReputation={userReputation}
          totalReputation={totalReputation}
          nativeToken={nativeToken}
          avatar={profile?.thumbnail || profile?.avatar || ''}
          user={user}
        />
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
        <TitledContent title={{ id: 'userMenu.optionsTitle' }}>
          <ul className="text-lg font-semibold md:font-normal md:text-md text-gray-900">
            <li className="mb-4">
              <Link to="/" className="flex items-center justify-between">
                <div className="flex items-center">
                  <Icon name="circles-three-plus" appearance={{ size: iconSize }} />
                  <p className="ml-2">{formatMessage({ id: 'userMenu.getStartedTitle' })}</p>
                </div>
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/" className="flex items-center justify-between">
                <div className="flex items-center">
                  <Icon name="lifebuoy" appearance={{ size: iconSize }} />
                  <p className="ml-2">{formatMessage({ id: 'userMenu.contactAndSupportTitle' })}</p>
                </div>
                <Icon name="caret-right" appearance={{ size: 'extraTiny' }} />
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/" className="flex items-center justify-between">
                <div className="flex items-center">
                  <Icon name="code" appearance={{ size: iconSize }} />
                  <p className="ml-2">{formatMessage({ id: 'userMenu.developersTitle' })}</p>
                </div>
                <Icon name="caret-right" appearance={{ size: 'extraTiny' }} />
              </Link>
            </li>
            <li>
              <Link to="/" className="flex items-center justify-between">
                <div className="flex items-center">
                  <Icon name="briefcase" appearance={{ size: iconSize }} />
                  <p className="ml-2">{formatMessage({ id: 'userMenu.legalAndPrivacyTitle' })}</p>
                </div>
                <Icon name="caret-right" appearance={{ size: 'extraTiny' }} />
              </Link>
            </li>
          </ul>
        </TitledContent>
      </div>
      {isWalletConnected && (
        <div className="w-full mb-6 md:mb-5">
          <TitledContent title={{ id: 'userMenu.other' }}>
            <Link to="/" className="flex items-center text-lg font-semibold md:font-normal md:text-md text-gray-900">
              <Icon name="plugs" appearance={{ size: iconSize }} />
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
