import React, { PropsWithChildren } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import styles from './Tooltip.module.css';
import { TooltipProps } from './types';

const Tooltip: React.FC<PropsWithChildren<TooltipProps>> = ({
  children,
  tooltipContent,
  placement = 'top',
  popperOptions,
  interactive,
  offset = [0, 12],
  showArrow = true,
  trigger = 'hover',
  isOpen,
  isSuccess = false,
}) => {
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip(
    {
      delayShow: 200,
      placement,
      trigger: tooltipContent ? trigger : null,
      visible: isOpen,
      delayHide: interactive ? 200 : 0,
      interactive,
      offset,
    },
    popperOptions,
  );

  return (
    <>
      <span className="cursor-pointer" ref={setTriggerRef}>
        {children}
      </span>
      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({
            className: `${
              styles.tooltipContainer
            } tooltip-container text-base-white z-[9999] relative font-medium text-sm p-3 ${
              isSuccess ? 'bg-success-400' : 'bg-gray-900'
            }`,
          })}
        >
          <div
            {...getArrowProps({
              className: `${showArrow ? `${styles.tooltipArrow} tooltip-arrow` : ''} ${
                isSuccess ? 'text-success-400' : 'text-gray-900'
              }`,
            })}
          />
          <div className="max-w-[15.625rem] flex flex-col items-start">{tooltipContent}</div>
        </div>
      )}
    </>
  );
};

export default Tooltip;
