import React, { FC, useState } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';

import { UserMenuProps } from './types';
import { useAppContext, useMobile } from '~hooks';
import Button from '~v5/shared/Button';
import Icon from '~shared/Icon';
import ThemeSwitcher from '~common/Extensions/ThemeSwitcher';
import styles from './UserMenu.module.css';
import PopoverBase from '~v5/shared/PopoverBase';
import WalletConnectedTopMenu from '../WalletConnectedTopMenu';
import Link from '~v5/shared/Link';
import UserSubmenu from '../UserSubmenu';
import { userMenuItems } from './consts';
import TitleLabel from '~v5/shared/TitleLabel';

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

  const iconName = isMobile ? 'caret-down' : 'caret-right';

  return (
    <PopoverBase
      setTooltipRef={setTooltipRef}
      tooltipProps={tooltipProps}
      withTooltipStyles
      classNames={clsx(styles.userMenuPopup, 'shadow-default', {
        'w-full border-none shadow-none': isMobile,
        'w-[20.125rem]': !isMobile,
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
          aria-label={formatMessage({ id: 'ariaLabel.backToMainMenu' })}
          className={clsx(styles.buttonBack, 'group text-4')}
          onClick={() => setActiveSubmenu(null)}
        >
          <Icon name="caret-left" appearance={{ size: 'extraExtraTiny' }} />
          {activeSubmenu && (
            <TitleLabel
              className="ml-2"
              text={formatMessage({ id: activeSubmenu })}
            />
          )}
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
            userName={profile?.displayName || name || ''}
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
              <Button
                mode="tertiary"
                size="small"
                isFullRounded
                iconName="cardholder"
                iconSize="extraTiny"
              >
                {formatMessage({ id: 'connectWallet' })}
              </Button>
              <Button
                mode="tertiary"
                size="small"
                isFullRounded
                iconName="list"
                iconSize="extraTiny"
              >
                {formatMessage({ id: 'help' })}
              </Button>
            </div>
            <div className="w-full pb-4 mb-6 border-b border-b-gray-200 sm:pb-3 sm:mb-5">
              <Button mode="quinary" isFullSize onClick={connectWallet}>
                {formatMessage({ id: 'connectWallet' })}
              </Button>
            </div>
          </>
        )}
        <div className="w-full pb-4 mb-6 border-b border-b-gray-200 sm:pb-3">
          <TitleLabel text={formatMessage({ id: 'userMenu.optionsTitle' })} />
          <ul className="text-left">
            {userMenuItems.map(({ id, link, icon, name: itemName }) => (
              <li key={id} className="mb-2 last:mb-0 sm:mb-0">
                {link ? (
                  <Link to={link} className="navigation-link">
                    <Icon name={icon} appearance={{ size: 'tiny' }} />
                    <p className="ml-2">{formatMessage({ id: itemName })}</p>
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="navigation-link"
                    onClick={() => setActiveSubmenu(itemName)}
                    aria-expanded={activeSubmenu === itemName}
                    aria-controls="actionsWithVisibility"
                  >
                    <span className="flex items-center shrink-0 mr-2 sm:mr-0 flex-grow">
                      <Icon name={icon} appearance={{ size: 'tiny' }} />
                      <p className="ml-2">{formatMessage({ id: itemName })}</p>
                    </span>
                    <Icon name={iconName} appearance={{ size: 'extraTiny' }} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
        {isWalletConnected && (
          <div className="w-full mb-4 sm:mb-3">
            <TitleLabel text={formatMessage({ id: 'userMenu.other' })} />
            <Link to="/" className="navigation-link">
              <Icon name="plugs" appearance={{ size: 'tiny' }} />
              <p className="ml-2">
                {formatMessage({ id: 'userMenu.disconnectWalletTitle' })}
              </p>
            </Link>
          </div>
        )}
        <ThemeSwitcher />
      </div>
    </PopoverBase>
  );
};

UserMenu.displayName = displayName;

export default UserMenu;
