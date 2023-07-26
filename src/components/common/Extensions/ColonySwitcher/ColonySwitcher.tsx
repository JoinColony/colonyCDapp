import React, { FC } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';

import ColoniesDropdown from './partials/ColoniesDropdown';
import ColonyAvatarWrapper from './partials/ColonyAvatarWrapper';
import ColonyDropdownMobile from './partials/ColonyDropdownMobile';
import styles from './ColonySwitcher.module.css';
import { useColonyContext, useMobile, useUserReputation } from '~hooks';
import { ColonySwitcherProps } from './types';
import { useHeader } from '~frame/Extensions/Header/hooks';
import NavigationTools from '../NavigationTools';

const displayName = 'common.Extensions.ColonySwitcher';

const ColonySwitcher: FC<ColonySwitcherProps> = ({
  isCloseButtonVisible,
  visible,
  isMainMenuVisible,
  setTooltipRef,
  setTriggerRef,
  getTooltipProps,
}) => {
  const isMobile = useMobile();
  const { formatMessage } = useIntl();

  const {
    colonyToDisplayAddress,
    colonyToDisplay,
    sortByDate,
    userLoading,
    user,
    wallet,
  } = useHeader();

  const { colony } = useColonyContext();
  const { profile } = user || {};
  const { colonyAddress, nativeToken } = colony || {};
  const { userReputation, totalReputation } = useUserReputation(
    colonyAddress,
    wallet?.address,
  );

  const { items: watchlist = [] } = user?.watchlist || {};

  return (
    <div className="flex justify-between relative">
      <button
        aria-label={formatMessage({
          id: visible ? 'ariaLabel.closeDropdown' : 'ariaLabel.openDropdown',
        })}
        ref={setTriggerRef}
        className="flex items-center justify-between transition-colors duration-normal hover:text-blue-400"
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
          {isMobile ? (
            <div
              ref={setTooltipRef}
              {...getTooltipProps({
                className: clsx(`flex justify-start z-[9999]`),
              })}
            >
              <ColonyDropdownMobile isOpen={visible} userLoading={userLoading}>
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
          ) : (
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
                <ColoniesDropdown watchlist={[...watchlist].sort(sortByDate)} />
              ) : (
                <p className="text-sm">
                  {formatMessage({ id: 'missing.colonies' })}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

ColonySwitcher.displayName = displayName;

export default ColonySwitcher;
