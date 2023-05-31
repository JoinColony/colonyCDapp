import clsx from 'clsx';
import React from 'react';

import { ColoniesDropdown, ColonyAvatarWrapper } from '~common/Extensions/ColonySwitcher';
import ColonyDropdownMobile from '~common/Extensions/ColonySwitcher/partials/ColonyDropdownMobile';
import { useMobile } from '~hooks';
import Icon from '~shared/Extensions/Icon';
import UserNavigation from '~common/Extensions/UserNavigation';
import MainNavigation from '~common/Extensions/MainNavigation';
import { watchlistMock } from '~common/Extensions/ColonySwitcher/consts';
import { useHeader } from './hooks';
import styles from './Header.module.css';

const displayName = 'common.Extensions.pages.Header';

const Header = () => {
  const isMobile = useMobile();
  const {
    colonyToDisplayAddress,
    getTooltipProps,
    isOpen,
    ref,
    setIsOpen,
    setTooltipRef,
    setTriggerRef,
    sortByDate,
    userLoading,
  } = useHeader();

  return (
    <header>
      <div className="bg-base-white w-full flex flex-row min-h-[5rem] sm:min-h-[6rem] justify-center px-6">
        <div className="flex items-center justify-between w-[90rem]">
          <div className="mr-5 sm:mr-10">
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

Header.displayName = displayName;

export default Header;
