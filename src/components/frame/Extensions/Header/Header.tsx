import clsx from 'clsx';
import React from 'react';
import { useIntl } from 'react-intl';

import { useColonyContext, useMobile, useUserReputation } from '~hooks';
import {
  ColoniesDropdown,
  ColonyAvatarWrapper,
} from '~common/Extensions/ColonySwitcher';
import ColonyDropdownMobile from '~common/Extensions/ColonySwitcher/partials/ColonyDropdownMobile';
import Icon from '~shared/Icon';
import UserNavigation from '~common/Extensions/UserNavigation';
import MainNavigation from '~common/Extensions/MainNavigation';
import { CloseButton } from '~v5/shared/Button';
import styles from './Header.module.css';
import { useHeader } from './hooks';
import NavigationTools from '~common/Extensions/NavigationTools/NavigationTools';

const displayName = 'frame.Extensions.Header';

const Header = () => {
  const isMobile = useMobile();
  const { formatMessage } = useIntl();
  const { colony } = useColonyContext();
  const {
    colonyToDisplayAddress,
    colonyToDisplay,
    sortByDate,
    userLoading,
    user,
    wallet,
    getTooltipProps,
    setTooltipRef,
    mainMenuGetTooltipProps,
    mainMenuSetTooltipRef,
    mainMenuSetTriggerRef,
    isMainMenuVisible,
    setTriggerRef,
    visible,
  } = useHeader();

  const { profile } = user || {};
  const { colonyAddress, nativeToken } = colony || {};
  const { userReputation, totalReputation } = useUserReputation(
    colonyAddress,
    wallet?.address,
  );

  const { items: watchlist = [] } = user?.watchlist || {};

  const isCloseButtonVisible = (isMainMenuVisible || visible) && isMobile;

  return (
    <header>
      <div className="bg-base-white w-full flex min-h-[5rem] sm:min-h-[6rem] justify-center px-6">
        <div className="flex items-center justify-between sm:max-w-[90rem] w-full">
          <div className="mr-5 sm:mr-10">
            <div className="flex justify-between relative">
              {/* @TODO It should be placed i a separate component Colony Switcher */}
              <button
                aria-label={formatMessage({ id: 'ariaLabel.openDropdown' })}
                ref={setTriggerRef}
                className="flex items-center justify-between hover:text-gray-600"
                type="button"
              >
                <ColonyAvatarWrapper
                  isOpen={visible || isMainMenuVisible}
                  isMobile={isMobile}
                  colonyToDisplayAddress={colonyToDisplayAddress}
                  colonyToDisplay={isCloseButtonVisible && colonyToDisplay}
                />
              </button>
              {visible && (
                <div className="h-auto absolute top-[3.5rem] sm:top-[2.25rem]">
                  {!isMobile && (
                    <div
                      ref={setTooltipRef}
                      {...getTooltipProps({
                        className: clsx(
                          `${styles.tooltipContainer} p-1 flex justify-start z-[9999] tooltip-container`,
                          {
                            'w-[26.75rem] border-none shadow-none': isMobile,
                            'w-[15.1875rem]': !isMobile,
                          },
                        ),
                      })}
                    >
                      {!!watchlist.length && !userLoading ? (
                        <ColoniesDropdown
                          watchlist={[...watchlist].sort(sortByDate)}
                        />
                      ) : (
                        <p className="text-sm">
                          {formatMessage({ id: 'missing.colonies' })}
                        </p>
                      )}
                    </div>
                  )}
                  {isMobile && (
                    <div
                      ref={setTooltipRef}
                      {...getTooltipProps({
                        className: clsx(`flex justify-start z-[9999]`),
                      })}
                    >
                      <ColonyDropdownMobile
                        isOpen={visible}
                        userLoading={userLoading}
                      >
                        <div className={styles.mobileButtons}>
                          <NavigationTools
                            nativeToken={nativeToken}
                            totalReputation={totalReputation}
                            userName={profile?.displayName || user?.name || ''}
                            userReputation={userReputation}
                            user={user}
                          />
                        </div>
                        {watchlist.length ? (
                          <ColoniesDropdown
                            watchlist={[...watchlist].sort(sortByDate)}
                            isMobile={isMobile}
                          />
                        ) : (
                          <p className="text-sm px-6">
                            {formatMessage({ id: 'missing.colonies' })}
                          </p>
                        )}
                      </ColonyDropdownMobile>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between w-full items-center">
            <button
              type="button"
              className={clsx('flex items-center sm:hidden', {
                'opacity-100 visible': !isMainMenuVisible,
                'opacity-0 invisible': isMainMenuVisible,
              })}
              ref={mainMenuSetTriggerRef}
              aria-label={formatMessage({ id: 'ariaLabel.openMenu' })}
            >
              <Icon name="list" appearance={{ size: 'tiny' }} />
              <span className="text-2 ml-1.5">
                {formatMessage({ id: 'menu' })}
              </span>
            </button>
            <MainNavigation
              setTooltipRef={mainMenuSetTooltipRef}
              tooltipProps={mainMenuGetTooltipProps}
              isMenuOpen={isMainMenuVisible}
            />
            <div>
              {isCloseButtonVisible ? (
                <CloseButton iconSize="tiny" />
              ) : (
                <UserNavigation />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.displayName = displayName;

export default Header;
