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
        'w-full overflow-hidden bg-base-white p-6 md:w-80 md:rounded-lg md:border md:border-gray-100 md:shadow-default',
        {
          '!top-full h-[calc(100dvh-var(--top-content-height))] !translate-y-0':
            isTablet,
        },
      )}
    >
      <div
        className={clsx('transition-transform', {
          '-translate-x-0': !activeSubmenu,
          'absolute -translate-x-[100vw]': activeSubmenu,
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
            <div className="mb-6 w-full pb-4 sm:pb-0">
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
            <li className="-ml-4 mb-2 w-[calc(100%+2rem)] rounded hover:bg-gray-50 sm:mb-0">
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
                className="-ml-4 mb-2 w-[calc(100%+2rem)] rounded hover:bg-gray-50 sm:mb-0"
              >
                <button
                  type="button"
                  className="navigation-link"
                  onClick={() => setActiveSubmenu(itemName)}
                  aria-expanded={activeSubmenu === itemName}
                  aria-controls="actionsWithVisibility"
                >
                  <span className="mr-2 flex shrink-0 flex-grow items-center sm:mr-0">
                    <Icon size={iconSize} />
                    <p className="ml-2">{formatText({ id: itemName })}</p>
                  </span>
                  {caretIcon}
                </button>
              </li>
            ))}

            {wallet && (
              <li className="-ml-4 mb-0 w-[calc(100%+2rem)] rounded hover:bg-gray-50">
                <button
                  type="button"
                  className="navigation-link"
                  onClick={() => setActiveSubmenu(UserMenuItemName.CURRENCY)}
                  aria-expanded={activeSubmenu === UserMenuItemName.CURRENCY}
                  aria-controls="actionsWithVisibility"
                >
                  <span className="mr-2 flex shrink-0 flex-grow items-center sm:mr-0">
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
            <div className="navigation-link -ml-4 w-[calc(100%+2rem)] rounded hover:bg-gray-50">
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
              className={clsx(styles.buttonBack, 'group mb-2 text-4')}
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
