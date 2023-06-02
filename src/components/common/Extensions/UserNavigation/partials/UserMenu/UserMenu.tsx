import React, { FC, useState } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';
import { UserMenuProps } from './types';
import { useAppContext, useMobile } from '~hooks';
import Button from '~shared/Extensions/Button';
import Icon from '~shared/Icon';
import ThemeSwitcher from '~common/Extensions/ThemeSwitcher';
import styles from './UserMenu.module.css';
import PopoverBase from '~shared/Extensions/PopoverBase';
import TitledContent from '~common/Extensions/TitledContent/TitledContent';
import WalletConnectedTopMenu from '../WalletConnectedTopMenu/WalletConnectedTopMenu';
import Link from '~shared/Extensions/Link';
import UserSubmenu from '../UserSubmenu';
import { userMenuItems } from './consts';

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
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const iconSize = isMobile ? 'small' : 'extraTiny';

  return (
    <PopoverBase
      setTooltipRef={setTooltipRef}
      tooltipProps={tooltipProps}
      classNames={clsx(styles.userMenuPopup, 'tooltip-container', {
        'w-full border-none shadow-none': isMobile,
        'w-[20.125rem]': !isMobile,
        'h-[32rem] md:h-[23rem]': !isWalletConnected && !activeSubmenu,
        'h-[35rem] md:h-[29rem]': isWalletConnected && !activeSubmenu,
        'h-[16rem]': activeSubmenu,
      })}
    >
      <div
        className={clsx('absolute inset-0 p-6 transition-transform', {
          'translate-x-0': activeSubmenu,
          'translate-x-full': !activeSubmenu,
        })}
      >
        <button
          type="button"
          aria-label="Back to main menu"
          className="flex items-center text-gray-400 text-xs font-medium"
          onClick={() => setActiveSubmenu(null)}
        >
          <Icon name="caret-left" appearance={{ size: 'extraTiny' }} />
          {activeSubmenu && <p className="ml-2 uppercase">{activeSubmenu && formatMessage({ id: activeSubmenu })}</p>}
        </button>
        {activeSubmenu && <UserSubmenu submenuId={activeSubmenu} />}
      </div>
      <div
        className={clsx('transition-transform', {
          '-translate-x-0': !activeSubmenu,
          '-translate-x-[100vw]': activeSubmenu,
        })}
      >
        {isWalletConnected && (
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
        )}
        {!isWalletConnected && (
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
            <ul className="text-lg font-semibold md:font-normal md:text-md">
              {userMenuItems.map((item) => (
                <li className="mb-4 last:mb-0" id={item.id}>
                  {item.link ? (
                    <Link to={item.link} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Icon name={item.icon} appearance={{ size: iconSize }} />
                        <p className="ml-2">{formatMessage({ id: item.name })}</p>
                      </div>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="flex items-center justify-between w-full"
                      onClick={() => setActiveSubmenu(item.name)}
                      aria-expanded={activeSubmenu === item.name}
                      aria-controls="actionsWithVisibility"
                    >
                      <div className="flex items-center">
                        <Icon name={item.icon} appearance={{ size: iconSize }} />
                        <p className="ml-2">{formatMessage({ id: item.name })}</p>
                      </div>
                      <Icon name="caret-right" appearance={{ size: 'extraTiny' }} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </TitledContent>
        </div>
        {isWalletConnected && (
          <div className="w-full mb-6 md:mb-5">
            <TitledContent title={{ id: 'userMenu.other' }}>
              <Link to="/" className="flex items-center text-lg font-semibold md:font-normal md:text-md">
                <Icon name="plugs" appearance={{ size: iconSize }} />
                <p className="ml-2">{formatMessage({ id: 'userMenu.disconnectWalletTitle' })}</p>
              </Link>
            </TitledContent>
          </div>
        )}
        <ThemeSwitcher />
      </div>
    </PopoverBase>
  );
};

UserMenu.displayName = displayName;

export default UserMenu;
