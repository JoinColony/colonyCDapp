import React from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import styles from './Tooltip.module.css';
import { TooltipProps } from './types';

const Tooltip = ({
  children,
  content,
  placement = 'top',
  popperOptions,
  showArrow = true,
  trigger = 'hover',
  isOpen,
}: TooltipProps) => {
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip(
    {
      delayShow: 200,
      placement,
      trigger: content ? trigger : null,
      visible: isOpen,
    },
    popperOptions,
  );

  return (
    <>
      <span ref={setTriggerRef}>{children}</span>
      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({
            className: `${styles.tooltipContainer} tooltip-container bg-gray-900 text-base-white z-[9999] relative font-medium text-sm p-3`,
          })}
        >
          <div
            {...getArrowProps({
              className: showArrow
                ? `${styles.tooltipArrow} tooltip-arrow text-gray-900`
                : '',
            })}
          />
          {content}
        </div>
      )}
    </>
  );
};

export default Tooltip;
