import { useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import { useSelectedColony } from '~common/Extensions/ColonySwitcher/hooks';
import { useAppContext, useDetectClickOutside, useMobile } from '~hooks';
import { watchListMock } from '~common/Extensions/ColonySwitcher/consts';

export const useHeader = () => {
  const { userLoading } = useAppContext();
  const [isOpen, setIsOpen] = useState<boolean>();

  const { colonyToDisplayAddress } = useSelectedColony(watchListMock);
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

  return {
    ref,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    userLoading,
    colonyToDisplayAddress,
    sortByDate,
    isOpen,
    setIsOpen,
  };
};
