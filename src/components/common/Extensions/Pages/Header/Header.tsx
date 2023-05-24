import clsx from 'clsx';
import React, { useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import { ColoniesDropdown, ColonyAvatarWrapper } from '~common/Extensions/ColonySwitcher';
import { watchlistMock } from '~common/Extensions/ColonySwitcher/consts';
import { useSelectedColony } from '~common/Extensions/ColonySwitcher/hooks';
import ColonyDropdownMobile from '~common/Extensions/ColonySwitcher/partials/ColonyDropdownMobile';
import { useAppContext, useDetectClickOutside, useMobile } from '~hooks';
import styles from './Header.module.css';
import Icon from '~shared/Icon';
import UserNavigation from '~common/Extensions/UserNavigation';
import MainNavigation from '~common/Extensions/MainNavigation';

const Header = () => {
  const { userLoading } = useAppContext();
  const [isOpen, setIsOpen] = useState<boolean>();

  const { colonyToDisplayAddress } = useSelectedColony(watchlistMock);
  const isMobile = useMobile();
  const popperTooltipOffset = !isMobile ? [120, 8] : [0, 8];

  const sortByDate = (firstWatchEntry, secondWatchEntry) => {
    const firstWatchTime = new Date(firstWatchEntry?.createdAt || 1).getTime();
    const secondWatchTime = new Date(secondWatchEntry?.createdAt || 1).getTime();
    return firstWatchTime - secondWatchTime;
  };

  const ref = useDetectClickOutside({ onTriggered: () => setIsOpen(false) });
  const { getTooltipProps, setTooltipRef, setTriggerRef } = usePopperTooltip(
    {
      delayShow: 200,
      placement: 'bottom',
      trigger: 'click',
      visible: isOpen,
      interactive: true,
    },
    {
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: popperTooltipOffset,
          },
        },
      ],
    },
  );

  return (
    <header>
      <div className="bg-base-white w-full flex flex-row min-h-[5rem] sm:min-h-[6.6875rem] justify-center px-6">
        <div className="flex items-center justify-between w-[90rem]">
          <div>
            <div className="flex justify-between relative" ref={ref}>
              <button
                aria-label="Open dropdown"
                className="flex items-center justify-between w-[3.5225rem]"
                onClick={() => setIsOpen((prevState) => !prevState)}
                type="button"
              >
                <ColonyAvatarWrapper
                  isOpen={isOpen}
                  isMobile={isMobile}
                  colonyToDisplayAddress={colonyToDisplayAddress}
                  setTriggerRef={setTriggerRef}
                />
              </button>

              {isOpen && (
                <div className="h-auto absolute top-[3.5rem] sm:top-[2.3rem]">
                  {!isMobile && (
                    <div
                      ref={setTooltipRef}
                      {...getTooltipProps({
                        className: clsx(
                          `${styles.tooltipContainer} h-[24.75rem] p-1 flex justify-center z-[9999] tooltip-container`,
                          {
                            'w-[26.75rem] border-none shadow-none': isMobile,
                            'w-[15.1875rem]': !isMobile,
                          },
                        ),
                      })}
                    >
                      {!!watchlistMock.length && !userLoading && (
                        <ColoniesDropdown watchlist={[...watchlistMock].sort(sortByDate)} />
                      )}
                    </div>
                  )}
                  {isMobile && (
                    <ColonyDropdownMobile isOpen={isOpen} userLoading={userLoading}>
                      {!!watchlistMock.length && (
                        <ColoniesDropdown watchlist={[...watchlistMock].sort(sortByDate)} isMobile={isMobile} />
                      )}
                    </ColonyDropdownMobile>
                  )}
                </div>
              )}

              {isMobile && isOpen && (
                <button
                  type="button"
                  aria-label="Close dropdown"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 sm:pr-4"
                >
                  <Icon name="close" appearance={{ size: 'extraTiny' }} />
                </button>
              )}
            </div>
          </div>
          {isMobile ? (
            <div className="flex justify-between">
              <div className="md:ml-auto">
                <UserNavigation />
              </div>
            </div>
          ) : (
            <div className="flex justify-between w-full items-center">
              <MainNavigation />
              <div className="block ml-auto">
                <UserNavigation />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
