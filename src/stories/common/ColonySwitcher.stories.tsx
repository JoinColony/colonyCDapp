import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import clsx from 'clsx';
import { usePopperTooltip } from 'react-popper-tooltip';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import ColonySwitcher, { ColoniesDropdown, ColonyAvatarWrapper } from '~common/Extensions/ColonySwitcher';
import { watchListMock } from '~common/Extensions/ColonySwitcher/consts';
import { useSelectedColony } from '~common/Extensions/ColonySwitcher/hooks';
import { useAppContext, useDetectClickOutside, useMobile } from '~hooks';
import Icon from '~shared/Icon';
import ColonyDropdownMobile from '~common/Extensions/ColonySwitcher/partials/ColonyDropdownMobile';
import styles from '~common/Extensions/ColonySwitcher/ColonySwitcher.module.css';
import UserNavigation from '~common/Extensions/UserNavigation';
import { getContext, ContextModule } from '~context';
import MainNavigation from '~common/Extensions/MainNavigation';

const meta: Meta<typeof ColonySwitcher> = {
  title: 'Common/Colony Switcher',
  component: ColonySwitcher,
};

export default meta;
type Story = StoryObj<typeof ColonySwitcher>;

const ColonySwitcherWithHooks = () => {
  const { userLoading } = useAppContext();
  const apolloClient = getContext(ContextModule.ApolloClient);
  const [isOpen, setIsOpen] = useState<boolean>();

  const { colonyToDisplay, colonyToDisplayAddress } = useSelectedColony(watchListMock);
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
    <ApolloProvider client={apolloClient}>
      <Router>
        <div className="bg-base-white w-full flex flex-row sm:min-h-[6.6875rem] justify-between px-6">
          <div className="flex flex-col sm:items-center sm:flex-row w-[90rem]">
            <div className="sm:mr-[2.5rem] mt-4 sm:mt-0">
              <div className="flex justify-between relative" ref={ref}>
                <button
                  aria-label="Open dropdown"
                  className={clsx('flex items-center justify-between', {
                    'w-[3.5225rem]': !isMobile,
                  })}
                  onClick={() => setIsOpen((prevState) => !prevState)}
                  type="button"
                >
                  <ColonyAvatarWrapper
                    isOpen={isOpen}
                    isMobile={isMobile}
                    colonyToDisplay={colonyToDisplay || 'Colony Name'}
                    colonyToDisplayAddress={colonyToDisplayAddress}
                    setTriggerRef={setTriggerRef}
                  />
                </button>

                {/* @TODO: add wallet buttons */}

                {isOpen && (
                  <div className="h-auto absolute top-[8.1rem] sm:top-[2.3rem]">
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
                        {!!watchListMock.length && !userLoading && (
                          <ColoniesDropdown watchlist={[...watchListMock].sort(sortByDate)} />
                        )}
                      </div>
                    )}
                    {isMobile && (
                      <ColonyDropdownMobile isOpen={isOpen} userLoading={userLoading}>
                        {!!watchListMock.length && (
                          <ColoniesDropdown watchlist={[...watchListMock].sort(sortByDate)} isMobile={isMobile} />
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
              <div className="flex justify-between mt-4 mb-6 md:mx-6">
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
        {isMobile && (
          <div className="border-t border-gray-200 mt-3 mb-3">
            <MainNavigation />
          </div>
        )}
      </Router>
    </ApolloProvider>
  );
};

export const Base: Story = {
  render: () => <ColonySwitcherWithHooks />,
};
