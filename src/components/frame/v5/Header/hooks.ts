import { usePopperTooltip } from 'react-popper-tooltip';

export const useHeader = () => {
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      delayShow: 200,
      delayHide: 200,
      placement: 'bottom-start',
      trigger: 'click',
      interactive: true,
    });

  return {
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  };
};
