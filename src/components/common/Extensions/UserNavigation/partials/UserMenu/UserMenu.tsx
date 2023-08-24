import React, { FC, useState } from 'react';
import clsx from 'clsx';

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
import NavigationTools from '~common/Extensions/NavigationTools';
import { ActionButton } from '~shared/Button';
import { ActionTypes } from '~redux';
import { formatText } from '~utils/intl';

const displayName = 'common.Extensions.UserNavigation.partials.UserMenu';

const UserMenu: FC<UserMenuProps> = ({
  tooltipProps,
  setTooltipRef,
  isWalletConnected,
  user,
  isVerified,
  walletAddress,
  nativeToken,
  hideColonies,
}) => {
  const isMobile = useMobile();
  const { connectWallet, updateWallet } = useAppContext();
  const { name, profile } = user || {};
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const iconName = isMobile ? 'caret-down' : 'caret-right';
  const iconSize = isMobile ? 'small' : 'extraSmall';

  return (
    <PopoverBase
      setTooltipRef={setTooltipRef}
      tooltipProps={tooltipProps}
      withTooltipStyles
      classNames={clsx(styles.userMenuPopup, 'shadow-default', {
        'border-none shadow-none': isMobile,
        'max-w-[20.125rem]': !isMobile,
      })}
    >
      <div
        className={clsx('transition-transform pt-[4.1625rem] sm:pt-0', {
          '-translate-x-0': !activeSubmenu,
          '-translate-x-[100vw] absolute': activeSubmenu,
        })}
      >
        {isMobile && (
          <div>
            <NavigationTools nativeToken={nativeToken} />
            <span className="divider mb-6" />
          </div>
        )}
        {isWalletConnected ? (
          <div className="px-6">
            <WalletConnectedTopMenu
              userName={profile?.displayName || name || ''}
              isVerified={isVerified}
              walletAddress={walletAddress}
              nativeToken={nativeToken}
              avatar={profile?.thumbnail || profile?.avatar || ''}
              hideColonies={hideColonies}
            />
          </div>
        ) : (
          <div className="px-6">
            <div className={styles.mobileButtons}>
              <Button
                mode="tertiary"
                size="small"
                isFullRounded
                iconName="cardholder"
                iconSize="extraTiny"
              >
                {formatText({ id: 'connectWallet' })}
              </Button>
              <Button
                mode="tertiary"
                size="small"
                isFullRounded
                iconName="list"
                iconSize="extraTiny"
              >
                {formatText({ id: 'help' })}
              </Button>
            </div>
            <div className="w-full pb-4 mb-6 border-b border-b-gray-200 sm:pb-3 sm:mb-5">
              <Button mode="quinary" isFullSize onClick={connectWallet}>
                {formatText({ id: 'connectWallet' })}
              </Button>
            </div>
          </div>
        )}
        <div className="w-full px-6 pb-4 mb-6 border-b border-b-gray-200 sm:pb-3">
          <TitleLabel text={formatText({ id: 'userMenu.optionsTitle' })} />
          <ul className="text-left">
            {userMenuItems.map(({ id, link, icon, name: itemName }) => (
              <li key={id} className="mb-2 last:mb-0 sm:mb-0">
                {link ? (
                  <Link to={link} className="navigation-link">
                    <Icon name={icon} appearance={{ size: iconSize }} />
                    <p className="ml-2">{formatText({ id: itemName })}</p>
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
                      <Icon name={icon} appearance={{ size: iconSize }} />
                      <p className="ml-2">{formatText({ id: itemName })}</p>
                    </span>
                    <Icon name={iconName} appearance={{ size: 'extraTiny' }} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="px-6">
          {isWalletConnected && (
            <div className="w-full mb-4 sm:mb-3">
              <TitleLabel text={formatText({ id: 'userMenu.other' })} />
              <div className="navigation-link">
                <Icon name="plugs" appearance={{ size: iconSize }} />
                <ActionButton
                  className="ml-2"
                  appearance={{ theme: 'no-style' }}
                  text={{ id: 'userMenu.disconnectWalletTitle' }}
                  actionType={ActionTypes.USER_LOGOUT}
                  onSuccess={updateWallet}
                />
              </div>
            </div>
          )}
          <ThemeSwitcher />
        </div>
      </div>
      <div
        className={clsx('transition-transform pt-[4.1625rem] sm:pt-0', {
          'translate-x-0': activeSubmenu,
          'translate-x-full': !activeSubmenu,
        })}
      >
        {activeSubmenu && (
          <div className="px-6">
            <button
              type="button"
              aria-label={formatText({ id: 'ariaLabel.backToMainMenu' })}
              className={clsx(styles.buttonBack, 'group text-4')}
              onClick={() => setActiveSubmenu(null)}
            >
              <Icon name="caret-left" appearance={{ size: 'extraExtraTiny' }} />

              <TitleLabel
                className="ml-2"
                text={formatText({ id: activeSubmenu })}
              />
            </button>
            <UserSubmenu submenuId={activeSubmenu} />
          </div>
        )}
      </div>
    </PopoverBase>
  );
};

UserMenu.displayName = displayName;

export default UserMenu;
