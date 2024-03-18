import {
  Cardholder,
  CaretDown,
  CaretLeft,
  CaretRight,
  CirclesThreePlus,
  List,
  Plugs,
} from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, useState } from 'react';

// @BETA: Disabled for now
// import ThemeSwitcher from '~common/Extensions/ThemeSwitcher';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useCurrencyContext } from '~context/CurrencyContext/CurrencyContext.ts';
import { useTablet } from '~hooks/index.ts';
import ClnyTokenIcon from '~icons/ClnyTokenIcon.tsx';
import { formatText } from '~utils/intl.ts';
import { splitWalletAddress } from '~utils/splitWalletAddress.ts';
import Button from '~v5/shared/Button/index.ts';
import Link from '~v5/shared/Link/index.ts';
import PopoverBase from '~v5/shared/PopoverBase/index.ts';
import TitleLabel from '~v5/shared/TitleLabel/index.ts';

import UserSubmenu from '../UserSubmenu/index.ts';
import WalletConnectedTopMenu from '../WalletConnectedTopMenu/index.ts';

import { currencyIcons, userMenuItems } from './consts.ts';
import { UserMenuItemName, type UserMenuProps } from './types.ts';

import styles from './UserMenu.module.css';

const displayName = 'common.Extensions.UserNavigation.partials.UserMenu';

const UserMenu: FC<UserMenuProps> = ({
  tooltipProps,
  setTooltipRef,
  isVerified,
}) => {
  const isTablet = useTablet();
  const { connectWallet, disconnectWallet, user, wallet } = useAppContext();
  const { profile } = user || {};
  const [activeSubmenu, setActiveSubmenu] = useState<UserMenuItemName | null>(
    null,
  );

  const caretIcon = isTablet ? (
    <CaretDown size={12} />
  ) : (
    <CaretRight size={12} />
  );
  const iconSize = isTablet ? 18 : 16;
  const { currency } = useCurrencyContext();

  const closeSubmenu = () => {
    setActiveSubmenu(null);
  };

  const CurrencyIcon = currencyIcons[currency] || ClnyTokenIcon;

  return (
    <PopoverBase
      setTooltipRef={setTooltipRef}
      tooltipProps={tooltipProps}
      withTooltipStyles={!isTablet}
      classNames={clsx(
        'w-full p-6 bg-base-white md:rounded-lg md:border md:border-gray-100 md:w-80 md:shadow-default overflow-hidden',
        {
          '!translate-y-0 !top-full h-[calc(100dvh-var(--top-content-height))]':
            isTablet,
        },
      )}
    >
      <div
        className={clsx('transition-transform', {
          '-translate-x-0': !activeSubmenu,
          '-translate-x-[100vw] absolute': activeSubmenu,
        })}
      >
        {wallet ? (
          <WalletConnectedTopMenu
            userName={
              profile?.displayName ?? splitWalletAddress(wallet.address ?? '')
            }
            isVerified={isVerified}
            walletAddress={wallet.address}
            avatar={profile?.thumbnail || profile?.avatar || ''}
          />
        ) : (
          <>
            <div className={styles.mobileButtons}>
              <Button
                mode="tertiary"
                size="small"
                isFullRounded
                icon={Cardholder}
                iconSize={12}
              >
                {formatText({ id: 'connectWallet' })}
              </Button>
              <Button
                mode="tertiary"
                size="small"
                isFullRounded
                icon={List}
                iconSize={12}
              >
                {formatText({ id: 'help' })}
              </Button>
            </div>
            <div className="w-full pb-4 mb-6 sm:pb-0">
              <Button mode="quinary" isFullSize onClick={connectWallet}>
                {formatText({ id: 'connectWallet' })}
              </Button>
            </div>
          </>
        )}
        <div
          className={clsx('w-full', {
            'mb-5 border-b border-b-gray-200 pb-4 sm:pb-3': wallet,
          })}
        >
          <TitleLabel text={formatText({ id: 'userMenu.optionsTitle' })} />
          <ul className="text-left">
            <li className="mb-2 sm:mb-0 hover:bg-gray-50 rounded -ml-4 w-[calc(100%+2rem)]">
              <Link to="/" className="navigation-link">
                <CirclesThreePlus size={iconSize} />
                <p className="ml-2">
                  {formatText({ id: 'userMenu.getStartedTitle' })}
                </p>
              </Link>
            </li>
            {userMenuItems.map(({ id, icon: Icon, name: itemName }) => (
              <li
                key={id}
                className="mb-2 sm:mb-0 hover:bg-gray-50 rounded -ml-4 w-[calc(100%+2rem)]"
              >
                <button
                  type="button"
                  className="navigation-link"
                  onClick={() => setActiveSubmenu(itemName)}
                  aria-expanded={activeSubmenu === itemName}
                  aria-controls="actionsWithVisibility"
                >
                  <span className="flex items-center shrink-0 mr-2 sm:mr-0 flex-grow">
                    <Icon size={iconSize} />
                    <p className="ml-2">{formatText({ id: itemName })}</p>
                  </span>
                  {caretIcon}
                </button>
              </li>
            ))}

            {wallet && (
              <li className="mb-0 hover:bg-gray-50 rounded -ml-4 w-[calc(100%+2rem)]">
                <button
                  type="button"
                  className="navigation-link"
                  onClick={() => setActiveSubmenu(UserMenuItemName.CURRENCY)}
                  aria-expanded={activeSubmenu === UserMenuItemName.CURRENCY}
                  aria-controls="actionsWithVisibility"
                >
                  <span className="flex items-center shrink-0 mr-2 sm:mr-0 flex-grow">
                    <CurrencyIcon size={iconSize} />
                    <p className="ml-2">{currency.toUpperCase()}</p>
                  </span>
                  {caretIcon}
                </button>
              </li>
            )}
          </ul>
        </div>
        {wallet && (
          <div className="w-full">
            <TitleLabel text={formatText({ id: 'userMenu.other' })} />
            <div className="navigation-link hover:bg-gray-50 rounded -ml-4 w-[calc(100%+2rem)]">
              <Plugs size={iconSize} />
              <button type="button" className="ml-2" onClick={disconnectWallet}>
                {formatText({ id: 'userMenu.disconnectWalletTitle' })}
              </button>
            </div>
          </div>
        )}
        {/* @BETA: Disabled for now */}
        {/* <ThemeSwitcher /> */}
      </div>
      <div
        className={clsx('transition-transform', {
          'translate-x-0': activeSubmenu,
          'translate-x-full': !activeSubmenu,
        })}
      >
        {activeSubmenu && (
          <>
            <button
              type="button"
              aria-label={formatText({ id: 'ariaLabel.backToMainMenu' })}
              className={clsx(styles.buttonBack, 'group text-4 mb-2')}
              onClick={closeSubmenu}
            >
              <CaretLeft size={10} />

              <TitleLabel
                className="ml-2"
                text={formatText({ id: activeSubmenu })}
              />
            </button>
            <UserSubmenu
              submenuId={activeSubmenu}
              closeSubmenu={closeSubmenu}
            />
          </>
        )}
      </div>
    </PopoverBase>
  );
};

UserMenu.displayName = displayName;

export default UserMenu;
