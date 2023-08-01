import React, { FC } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';

import ColoniesDropdown from './partials/ColoniesDropdown';
import ColonyAvatarWrapper from './partials/ColonyAvatarWrapper';
import ColonyDropdownMobile from './partials/ColonyDropdownMobile';
import styles from './ColonySwitcher.module.css';
import { useMobile } from '~hooks';
import { ColonySwitcherProps } from './types';
import { useHeader } from '~frame/Extensions/Header/hooks';
import NavigationTools from '../NavigationTools';
import PopoverBase from '~v5/shared/PopoverBase';
import { useGetNetworkToken } from '~hooks/useGetNetworkToken';

const displayName = 'common.Extensions.ColonySwitcher';

const ColonySwitcher: FC<ColonySwitcherProps> = ({
  isCloseButtonVisible,
  isColonyDropdownOpen,
  setTooltipRef,
  setTriggerRef,
  getTooltipProps,
  isArrowVisible,
}) => {
  const isMobile = useMobile();
  const { formatMessage } = useIntl();
  const nativeToken = useGetNetworkToken();
  const {
    colonyToDisplayAddress,
    colonyToDisplay,
    sortByDate,
    userLoading,
    user,
  } = useHeader();

  const { items: watchlist = [] } = user?.watchlist || {};

  return (
    <div
      className={clsx('flex justify-between', {
        relative: !isMobile,
      })}
    >
      <button
        aria-label={formatMessage({
          id: isColonyDropdownOpen
            ? 'ariaLabel.closeDropdown'
            : 'ariaLabel.openDropdown',
        })}
        ref={setTriggerRef}
        className="flex items-center justify-between transition-colors duration-normal hover:text-blue-400 z-[51]"
        type="button"
      >
        <ColonyAvatarWrapper
          isArrowVisible={isArrowVisible}
          isMobile={isMobile}
          colonyToDisplayAddress={colonyToDisplayAddress}
          colonyToDisplay={isCloseButtonVisible && colonyToDisplay}
        />
      </button>
      {isColonyDropdownOpen && (
        <div
          className={
            !isMobile ? 'h-auto absolute top-[3.5rem] sm:top-[2.25rem]' : ''
          }
        >
          {isMobile ? (
            <PopoverBase
              setTooltipRef={setTooltipRef}
              tooltipProps={getTooltipProps}
              classNames="w-full border-none shadow-none px-0 pt-0 pb-6 bg-base-white"
            >
              <ColonyDropdownMobile
                isOpen={isColonyDropdownOpen}
                userLoading={userLoading}
              >
                <NavigationTools nativeToken={nativeToken} />
                <span className="divider mb-6" />
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
            </PopoverBase>
          ) : (
            <div
              ref={setTooltipRef}
              {...getTooltipProps({
                className: clsx(
                  styles.tooltipContainer,
                  'p-1 flex justify-start z-50 tooltip-container w-[15.1875rem]',
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
