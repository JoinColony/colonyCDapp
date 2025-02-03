import {
  Cardholder,
  CaretLeft,
  CaretRight,
  CirclesThreePlus,
  List,
  Plugs,
} from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, useContext, useState } from 'react';

import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useCurrencyContext } from '~context/CurrencyContext/CurrencyContext.ts';
import { FeatureFlagsContext } from '~context/FeatureFlagsContext/FeatureFlagsContext.ts';
import { useTablet } from '~hooks/index.ts';
import ClnyTokenIcon from '~icons/ClnyTokenIcon.tsx';
import { formatText } from '~utils/intl.ts';
import { splitWalletAddress } from '~utils/splitWalletAddress.ts';
import ThemeSwitcher from '~v5/common/ThemeSwitcher/ThemeSwitcher.tsx';
import Button from '~v5/shared/Button/index.ts';
import Link from '~v5/shared/Link/index.ts';
import PopoverBase from '~v5/shared/PopoverBase/index.ts';
import TitleLabel from '~v5/shared/TitleLabel/index.ts';
import UserDetails from '~v5/shared/UserDetails/index.ts';

import UserSubmenu from '../UserSubmenu/index.ts';
import WalletConnectedTopMenu from '../WalletConnectedTopMenu/index.ts';

import { currencyIcons, userMenuItems } from './consts.ts';
import { UserMenuItemName, type UserMenuProps } from './types.ts';

const displayName = 'common.Extensions.UserNavigation.partials.UserMenu';

const UserMenu: FC<UserMenuProps> = ({
  tooltipProps,
  setTooltipRef,
  isVerified,
  setVisible,
}) => {
  const isTablet = useTablet();
  const { connectWallet, disconnectWallet, user, wallet } = useAppContext();
  const { profile } = user || {};
  const [activeSubmenu, setActiveSubmenu] = useState<UserMenuItemName | null>(
    null,
  );
  const { isActionSidebarOpen } = useActionSidebarContext();

  const iconSize = isTablet ? 18 : 16;
  const { currency } = useCurrencyContext();

  const closeSubmenu = () => {
    setActiveSubmenu(null);
  };

  const CurrencyIcon = currencyIcons[currency] || ClnyTokenIcon;

  const featureFlags = useContext(FeatureFlagsContext);

  const filteredUserMenuItems = userMenuItems.filter(({ featureFlag }) => {
    if (!featureFlag) return true;
    const flag = featureFlags[featureFlag];
    return !flag?.isLoading && flag?.isEnabled;
  });

  return (
    <PopoverBase
      setTooltipRef={setTooltipRef}
      tooltipProps={tooltipProps}
      withTooltipStyles={!isTablet}
      className={clsx(
        '!h-dynamic-screen w-full overflow-auto bg-base-white p-6 sm:h-auto md:w-80 md:rounded-lg md:border md:border-gray-100 md:shadow-default',
        {
          '!top-[calc(var(--header-nav-section-height))] !translate-y-0':
            isTablet && isActionSidebarOpen,
          '!top-[calc(var(--header-nav-section-height)+var(--top-content-height))] !translate-y-0':
            isTablet && !isActionSidebarOpen,
        },
      )}
    >
      <div
        data-testid="user-menu"
        className={clsx('transition-transform', {
          '-translate-x-0': !activeSubmenu,
          'absolute -translate-x-[100vw]': activeSubmenu,
        })}
      >
        {wallet ? (
          <WalletConnectedTopMenu>
            <UserDetails
              userName={
                profile?.displayName ?? splitWalletAddress(wallet.address ?? '')
              }
              isVerified={isVerified}
              walletAddress={wallet.address}
              userAvatarSrc={profile?.thumbnail || profile?.avatar || undefined}
            />
          </WalletConnectedTopMenu>
        ) : (
          <>
            <div className="mb-6 flex w-full items-center gap-1 border-b border-b-gray-200 pb-6 md:mb-5 md:hidden md:pb-5">
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
            <div className="mb-6 w-full pb-4 md:pb-0">
              <Button mode="quinary" isFullSize onClick={connectWallet}>
                {formatText({ id: 'connectWallet' })}
              </Button>
            </div>
          </>
        )}
        <div
          className={clsx('w-full', {
            'mb-6 border-b border-b-gray-200 pb-2 md:pb-3': wallet,
          })}
        >
          <TitleLabel
            text={formatText({ id: 'userMenu.optionsTitle' })}
            className="pb-2"
          />
          <ul className="text-left">
            <li className="-ml-4 mb-2 w-[calc(100%+2rem)] rounded hover:bg-gray-50 md:mb-0">
              <Link to="/" className="navigation-link">
                <CirclesThreePlus size={iconSize} />
                <p className="ml-2">
                  {formatText({ id: 'userMenu.getStartedTitle' })}
                </p>
              </Link>
            </li>
            {filteredUserMenuItems.map(({ id, icon: Icon, name: itemName }) => (
              <li
                key={id}
                className="-ml-4 mb-2 w-[calc(100%+2rem)] rounded hover:bg-gray-50 md:mb-0"
              >
                <button
                  type="button"
                  className="navigation-link"
                  onClick={() => setActiveSubmenu(itemName)}
                  aria-expanded={activeSubmenu === itemName}
                  aria-controls="actionsWithVisibility"
                >
                  <span className="mr-2 flex shrink-0 flex-grow items-center md:mr-0">
                    <Icon size={iconSize} />
                    <p className="ml-2">{formatText({ id: itemName })}</p>
                  </span>
                  <CaretRight size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>
        {wallet && (
          <ul className="text-left">
            <li className="w-full">
              <TitleLabel
                text={formatText({ id: 'userMenu.other' })}
                className="pb-2"
              />
              <div className="navigation-link -ml-4 mb-2 w-[calc(100%+2rem)] rounded hover:bg-gray-50 md:mb-0">
                <Plugs size={iconSize} />
                <button
                  type="button"
                  className="ml-2"
                  onClick={disconnectWallet}
                >
                  {formatText({ id: 'userMenu.disconnectWalletTitle' })}
                </button>
              </div>
            </li>
            <li className="-ml-4 mb-0 w-[calc(100%+2rem)] rounded hover:bg-gray-50">
              <button
                type="button"
                className="navigation-link"
                onClick={() => setActiveSubmenu(UserMenuItemName.CURRENCY)}
                aria-expanded={activeSubmenu === UserMenuItemName.CURRENCY}
                aria-controls="actionsWithVisibility"
              >
                <span className="mr-2 flex shrink-0 flex-grow items-center md:mr-0">
                  <CurrencyIcon size={iconSize} />
                  <p className="ml-2">{currency.toUpperCase()}</p>
                </span>
                <CaretRight size={16} />
              </button>
            </li>
          </ul>
        )}
        <div className="mt-4">
          <ThemeSwitcher />
        </div>
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
              className="group mb-2 flex w-full items-center text-gray-400 transition-all duration-normal text-4 hover:text-blue-400"
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
              setVisible={setVisible}
            />
          </>
        )}
      </div>
    </PopoverBase>
  );
};

UserMenu.displayName = displayName;

export default UserMenu;
