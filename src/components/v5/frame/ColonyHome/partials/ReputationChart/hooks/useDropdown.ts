import { useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

const useDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      placement: 'bottom-end',
      trigger: ['click'],
      visible: isDropdownOpen,
      onVisibleChange: setIsDropdownOpen,
      interactive: true,
      closeOnOutsideClick: true,
      offset: [0, 0],
    });

  return {
    isDropdownOpen,
    setIsDropdownOpen,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  };
};

export default useDropdown;
