import { usePopperTooltip } from 'react-popper-tooltip';
import { useState } from 'react';
import { useSelectedColony } from '~common/Extensions/ColonySwitcher/hooks';
import { useAppContext, useMobile } from '~hooks';
import { watchListMock } from '~common/Extensions/ColonySwitcher/consts';

export const useHeader = () => {
  const { userLoading, user, wallet } = useAppContext();
  const isMobile = useMobile();
  const [isWalletButtonVisible, setIsWalletButtonVisible] = useState(true);

  const { colonyToDisplayAddress, colonyToDisplay } =
    useSelectedColony(watchListMock);

  const sortByDate = (firstWatchEntry, secondWatchEntry) => {
    const firstWatchTime = new Date(firstWatchEntry?.createdAt || 1).getTime();
    const secondWatchTime = new Date(
      secondWatchEntry?.createdAt || 1,
    ).getTime();
    return firstWatchTime - secondWatchTime;
  };

  const {
    getTooltipProps: colonySwitcherGetTooltipProps,
    setTooltipRef: colonySwitcherSetTooltipRef,
    setTriggerRef: colonySwitcherSetTriggerRef,
    visible: isColonySwitcherOpen,
  } = usePopperTooltip(
    {
      delayShow: isMobile ? 0 : 200,
      delayHide: isMobile ? 0 : 200,
      placement: 'bottom',
      trigger: 'click',
      interactive: true,
    },
    {
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: isMobile ? [0, -69] : [120, 8],
          },
        },
      ],
    },
  );

  const {
    getTooltipProps: mainMenuGetTooltipProps,
    setTooltipRef: mainMenuSetTooltipRef,
    setTriggerRef: mainMenuSetTriggerRef,
    visible: isMainMenuOpen,
  } = usePopperTooltip(
    {
      delayShow: isMobile ? 0 : 200,
      delayHide: isMobile ? 0 : 200,
      placement: 'bottom',
      trigger: 'click',
      interactive: true,
    },
    {
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, -61],
          },
        },
      ],
    },
  );

  const {
    getTooltipProps: userMenuGetTooltipProps,
    setTooltipRef: userMenuSetTooltipRef,
    setTriggerRef: userMenuSetTriggerRef,
    visible: isUserMenuOpen,
  } = usePopperTooltip(
    {
      delayShow: isMobile ? 0 : 200,
      delayHide: 0,
      placement: isMobile ? 'bottom' : 'bottom-end',
      trigger: 'click',
      interactive: true,
      onVisibleChange: (newVisible) => {
        if (!newVisible && isMobile) {
          setIsWalletButtonVisible(true);
        }
      },
    },
    {
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: isMobile ? [0, -71] : [0, 8],
          },
        },
      ],
    },
  );

  const { setTriggerRef: setWalletTriggerRef, visible: isWalletOpen } =
    usePopperTooltip(
      {
        delayShow: isMobile ? 0 : 200,
        delayHide: 0,
        placement: isMobile ? 'bottom' : 'bottom-end',
        trigger: 'click',
        interactive: true,
        onVisibleChange: (newVisible) => {
          if (!newVisible && isMobile) {
            setIsWalletButtonVisible(true);
          }
        },
      },
      {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: isMobile ? [0, -71] : [0, 8],
            },
          },
        ],
      },
    );

  return {
    colonySwitcherGetTooltipProps,
    colonySwitcherSetTooltipRef,
    colonySwitcherSetTriggerRef,
    mainMenuGetTooltipProps,
    mainMenuSetTooltipRef,
    mainMenuSetTriggerRef,
    userMenuGetTooltipProps,
    userMenuSetTooltipRef,
    userMenuSetTriggerRef,
    setWalletTriggerRef,
    isColonySwitcherOpen,
    isMainMenuOpen,
    isWalletOpen,
    isUserMenuOpen,
    userLoading,
    colonyToDisplayAddress,
    colonyToDisplay,
    sortByDate,
    user,
    wallet,
    isWalletButtonVisible,
  };
};
