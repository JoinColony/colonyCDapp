import React, { useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import clsx from 'clsx';
import { useDetectClickOutside, useAppContext, useMobile } from '~hooks';
import ColoniesDropdown from './ColoniesDropdown';
import Icon from '~shared/Icon';
import { useSelectedColony } from './hooks';
import { SpinnerLoader } from '~shared/Preloaders';
import ColonyAvatarWrapper from './ColonyAvatarWrapper';

const displayName = 'common.Extensions.ColonySwitcher';

const ColonySwitcher = () => {
  const { user, userLoading } = useAppContext();
  const [isOpen, setIsOpen] = useState<boolean>();

  const { items: watchlist = [] } = user?.watchlist || {};

  const { colonyToDisplay, colonyToDisplayAddress } = useSelectedColony(watchlist);
  const isMobile = useMobile();

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
          name: 'eventListeners',
          options: { scroll: true },
        },
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ],
    },
  );

  return (
    <div className="flex justify-between w-full md:w-[3.5225rem]" ref={ref}>
      <button
        aria-label="Open dropdown"
        className={clsx('flex items-center justify-between', {
          'w-[9.3125rem]': isMobile,
          'w-[3.5225rem]': !isMobile,
        })}
        onClick={() => setIsOpen((prevState) => !prevState)}
        type="button"
      >
        <ColonyAvatarWrapper
          isOpen={isOpen}
          isMobile={isMobile}
          colonyToDisplay={colonyToDisplay}
          colonyToDisplayAddress={colonyToDisplayAddress}
          setTriggerRef={setTriggerRef}
        />
      </button>

      {isOpen && (
        <div className="relative h-auto">
          <div
            ref={setTooltipRef}
            {...getTooltipProps({
              className: clsx('h-[24.75rem] p-1 flex justify-center z-[9999] tooltip-container', {
                'w-[23.75rem]': isMobile,
                'w-[15.1875rem]': !isMobile,
              }),
            })}
          >
            {userLoading && (
              <div className="h-[24.75rem] p-1 flex justify-center">
                <SpinnerLoader appearance={{ size: 'medium' }} />
              </div>
            )}
            {!!watchlist.length && !userLoading && <ColoniesDropdown watchlist={[...watchlist].sort(sortByDate)} />}
          </div>
        </div>
      )}

      {isMobile && (
        <button
          type="button"
          aria-label="Close dropdown"
          onClick={() => setIsOpen(false)}
          className="[&<i<svg]:fill-gray-400 [&<i<svg]:stroke-gray-400"
        >
          <Icon name="close" appearance={{ size: 'extraTiny' }} />
        </button>
      )}
    </div>
  );
};

ColonySwitcher.displayName = displayName;

export default ColonySwitcher;
