import React, { useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import clsx from 'clsx';
import { useIntl } from 'react-intl';

import { useDetectClickOutside, useAppContext, useMobile } from '~hooks';
import ColoniesDropdown from './partials/ColoniesDropdown';
import Icon from '~shared/Icon';
import { useSelectedColony } from './hooks';
import { SpinnerLoader } from '~shared/Preloaders';
import ColonyAvatarWrapper from './partials/ColonyAvatarWrapper';
import ColonyDropdownMobile from './partials/ColonyDropdownMobile';
import styles from './ColonySwitcher.module.css';

const displayName = 'common.Extensions.ColonySwitcher';

const ColonySwitcher = () => {
  const { user, userLoading } = useAppContext();
  const [isOpen, setIsOpen] = useState<boolean>();

  const { items: watchlist = [] } = user?.watchlist || {};

  const { formatMessage } = useIntl();
  const { colonyToDisplay, colonyToDisplayAddress } = useSelectedColony(watchlist);
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

  const watchlistSorted = [...watchlist].sort(sortByDate);

  return (
    <div className="flex justify-between relative" ref={ref}>
      <button
        aria-label={formatMessage({ id: 'open.dropdown' })}
        className={clsx('flex items-center justify-between', {
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
              {userLoading && (
                <div className="h-[24.75rem] p-1 flex justify-center">
                  <SpinnerLoader appearance={{ size: 'medium' }} />
                </div>
              )}
              {!!watchlist.length && !userLoading && <ColoniesDropdown watchlist={watchlistSorted} />}
            </div>
          )}
          {isMobile && (
            <ColonyDropdownMobile isOpen={isOpen} userLoading={userLoading}>
              {!!watchlist.length && !userLoading && (
                <ColoniesDropdown watchlist={watchlistSorted} isMobile={isMobile} />
              )}
            </ColonyDropdownMobile>
          )}
        </div>
      )}

      {isMobile && isOpen && (
        <button
          type="button"
          aria-label={formatMessage({ id: 'close.dropdown' })}
          onClick={() => setIsOpen(false)}
          className="text-gray-400 sm:pr-4"
        >
          <Icon name="close" appearance={{ size: 'extraTiny' }} />
        </button>
      )}
    </div>
  );
};

ColonySwitcher.displayName = displayName;

export default ColonySwitcher;
