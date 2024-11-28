import { useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

export const useSearchFilter = () => {
  const [isSearchOpened, setIsSearchOpened] = useState(false);
  const { getTooltipProps, setTooltipRef, setTriggerRef } = usePopperTooltip({
    delayShow: 200,
    delayHide: 200,
    placement: 'bottom-start',
    trigger: 'click',
    interactive: true,
    visible: isSearchOpened,
    onVisibleChange: setIsSearchOpened,
  });

  const closeSearch = () => {
    setIsSearchOpened(false);
  };

  const openSearch = () => {
    setIsSearchOpened(true);
  };

  const toggleSearch = () => {
    setIsSearchOpened((prev) => !prev);
  };

  return {
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    isSearchOpened,
    closeSearch,
    openSearch,
    toggleSearch,
  };
};
