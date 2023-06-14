import { usePopperTooltip } from 'react-popper-tooltip';
import { useSelectedColony } from '~common/Extensions/ColonySwitcher/hooks';
import { useAppContext, useMobile } from '~hooks';
import { watchListMock } from '~common/Extensions/ColonySwitcher/consts';

export const useHeader = () => {
  const { userLoading, user, wallet } = useAppContext();
  const isMobile = useMobile();

  const { colonyToDisplayAddress, colonyToDisplay } =
    useSelectedColony(watchListMock);

  const sortByDate = (firstWatchEntry, secondWatchEntry) => {
    const firstWatchTime = new Date(firstWatchEntry?.createdAt || 1).getTime();
    const secondWatchTime = new Date(
      secondWatchEntry?.createdAt || 1,
    ).getTime();
    return firstWatchTime - secondWatchTime;
  };

  const popperTooltipOffset = !isMobile ? [120, 8] : [0, 20];
  const menuPopperTooltipOffset = [0, 20];

  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip(
      {
        delayShow: 200,
        placement: 'bottom',
        trigger: 'click',
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

  const {
    getTooltipProps: mainMenuGetTooltipProps,
    setTooltipRef: mainMenuSetTooltipRef,
    setTriggerRef: mainMenuSetTriggerRef,
    visible: mainMenuVisible,
  } = usePopperTooltip(
    {
      delayShow: 200,
      delayHide: 200,
      placement: 'bottom',
      trigger: 'click',
      interactive: true,
    },
    {
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: menuPopperTooltipOffset,
          },
        },
      ],
    },
  );

  return {
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
    mainMenuGetTooltipProps,
    mainMenuSetTooltipRef,
    mainMenuSetTriggerRef,
    mainMenuVisible,
    userLoading,
    colonyToDisplayAddress,
    colonyToDisplay,
    sortByDate,
    user,
    wallet,
  };
};
