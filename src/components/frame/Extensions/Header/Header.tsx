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
import Button from '~shared/Extensions/Button';
import Token from '~common/Extensions/UserNavigation/partials/Token';
import UserAvatar from '~shared/Extensions/UserAvatar';
import MemberReputation from '~common/Extensions/UserNavigation/partials/MemberReputation';
import styles from './Header.module.css';
import { useHeader } from './hooks';
import { useExtensionsContext } from '~context/ExtensionsContext';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isExtensionInstalling } = useExtensionsContext();

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
        <div className="flex items-center justify-between max-w-[90rem] w-full">
          <div className="mr-5 sm:mr-10">
            <div className="flex justify-between relative">
              <button
                aria-label="Open dropdown"
                ref={setTriggerRef}
                className={clsx(
                  'flex items-center justify-between transition-all duration-normal hover:text-gray-600',
                  {
                    'w-[3.5rem]': !isMainMenuVisible,
                    'w-[8rem]': isMainMenuVisible,
                  },
                )}
                type="button"
              >
                <ColonyAvatarWrapper
                  isOpen={visible}
                  isMobile={isMobile}
                  colonyToDisplayAddress={colonyToDisplayAddress}
                  colonyToDisplay={
                    isMainMenuVisible ? colonyToDisplay : undefined
                  }
                />
              </button>
              {visible && (
                <div className="h-auto absolute top-[3.5rem] sm:top-[2.3rem]">
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
                      {!!watchlist.length && !userLoading && (
                        <ColoniesDropdown
                          watchlist={[...watchlist].sort(sortByDate)}
                        />
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
                          {nativeToken && <Token nativeToken={nativeToken} />}
                          <Button mode="tertiaryOutline" isFullRounded>
                            <div className="flex items-center gap-3">
                              <UserAvatar
                                userName={
                                  profile?.displayName || user?.name || ''
                                }
                                size="xxs"
                                user={user}
                              />
                              <MemberReputation
                                userReputation={userReputation}
                                totalReputation={totalReputation}
                                hideOnMobile={false}
                              />
                            </div>
                          </Button>
                          <Button mode="tertiaryOutline" isFullRounded>
                            <Icon
                              name="list"
                              appearance={{ size: 'extraTiny' }}
                            />
                          </Button>
                        </div>
                        {!!watchlist.length && (
                          <ColoniesDropdown
                            watchlist={[...watchlist].sort(sortByDate)}
                            isMobile={isMobile}
                          />
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
            >
              <Icon name="list" appearance={{ size: 'tiny' }} />
              <p className="text-sm font-medium ml-1.5">
                {formatMessage({ id: 'menu' })}
              </p>
            </button>
            <MainNavigation
              setTooltipRef={mainMenuSetTooltipRef}
              tooltipProps={mainMenuGetTooltipProps}
              isMenuOpen={isMainMenuVisible}
            />
            <div className="block ml-auto">
              {isCloseButtonVisible ? (
                <Button
                  className="md:border-gray-200 md:hover:border-blue-400 px-4 py-2.5 border-base-white"
                  mode="quinary"
                  isFullRounded
                >
                  <Icon name="close" appearance={{ size: 'tiny' }} />
                </Button>
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
