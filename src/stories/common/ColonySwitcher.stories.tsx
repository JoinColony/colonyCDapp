import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import clsx from 'clsx';
import { usePopperTooltip } from 'react-popper-tooltip';
import { BrowserRouter as Router } from 'react-router-dom';
import ColonySwitcher, { ColoniesDropdown, ColonyAvatarWrapper } from '~common/Extensions/ColonySwitcher';
import { watchlistMock } from '~common/Extensions/ColonySwitcher/consts';
import { useSelectedColony } from '~common/Extensions/ColonySwitcher/hooks';
import { useAppContext, useDetectClickOutside, useMobile } from '~hooks';
import Icon from '~shared/Icon';
import ColonyDropdownMobile from '~common/Extensions/ColonySwitcher/ColonyDropdownMobile';

const meta: Meta<typeof ColonySwitcher> = {
  title: 'Common/Colony Switcher',
  component: ColonySwitcher,
};

export default meta;
type Story = StoryObj<typeof ColonySwitcher>;

export const ColonySwitcherWithHooks = () => {
  const { userLoading } = useAppContext();
  const [isOpen, setIsOpen] = useState<boolean>();

  const { colonyToDisplay, colonyToDisplayAddress } = useSelectedColony(watchlistMock);
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
    <Router>
      <div
        className="bg-base-white max-w-[26.75rem] md:max-w-full md:h-[6.6875rem] flex flex-row 
  justify-between md:px-6 border-b border-gray-200 md:border-b-0"
      >
        <div
          className="flex flex-col md:items-center md:flex-row max-w-[26.75rem]
        w-[26.75rem] md:w-full md:max-w-full"
        >
          <div className="md:mr-[3.5rem] w-[26.75rem] md:w-auto">
            <div
              className="flex justify-between max-w-[26.75rem] w-[26.75rem] md:w-auto relative mx-4 mb:mx-0"
              ref={ref}
            >
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
                <div className="h-auto absolute top-[6.5rem] md:top-[2.3rem]">
                  {!isMobile && (
                    <div
                      ref={setTooltipRef}
                      {...getTooltipProps({
                        className: clsx('h-[24.75rem] p-1 flex justify-center z-[9999] tooltip-container', {
                          'w-[26.75rem] border-none shadow-none': isMobile,
                          'w-[15.1875rem]': !isMobile,
                        }),
                      })}
                    >
                      {!!watchlistMock.length && !userLoading && (
                        <ColoniesDropdown watchlist={[...watchlistMock].sort(sortByDate)} />
                      )}
                    </div>
                  )}
                  {isMobile && (
                    <ColonyDropdownMobile isOpen={isOpen} isMobile={isMobile} userLoading={userLoading}>
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
                  className="[&<i<svg]:fill-gray-400 [&<i<svg]:stroke-gray-400 pr-4"
                >
                  <Icon name="close" appearance={{ size: 'extraTiny' }} />
                </button>
              )}
            </div>
          </div>
          {isMobile ? (
            <div className="flex justify-between mt-6 mb-4 mx-4 md:mx-0">
              <div>Menu</div>
              <div className="ml-auto">wallett</div>
            </div>
          ) : (
            <div className="flex justify-between">
              <div className="flex flex-row">
                <div className="mx-2">Dashboard</div>
                <div className="mx-2">Members</div>
                <div className="mx-2">Decisions</div>
                <div className="mx-2">More</div>
              </div>
              <div>wallett</div>
            </div>
          )}
        </div>
      </div>
    </Router>
  );
};

export const Base: Story = {
  render: () => <ColonySwitcherWithHooks />,
};
