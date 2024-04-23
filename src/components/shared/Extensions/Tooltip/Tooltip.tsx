import { Check } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import tooltipClasses from './Tooltip.styles.ts';
import { type TooltipProps } from './types.ts';

const displayName = 'Extensions.Tooltip';

const Tooltip: FC<PropsWithChildren<TooltipProps>> = ({
  children,
  tooltipContent,
  placement = 'auto',
  popperOptions,
  interactive,
  offset = [0, 12],
  showArrow = true,
  trigger = 'hover',
  isOpen,
  isSuccess = false,
  isFullWidthContent,
  className,
  selectTriggerRef = (v) => v,
}) => {
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
      <div
        className={clsx(className, 'flex', {
          'w-full': isFullWidthContent,
        })}
        ref={(ref) => {
          setTriggerRef(selectTriggerRef(ref));
        }}
      >
        {children}
      </div>
      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({
            className: clsx(
              tooltipClasses.tooltipContainer,
              'tooltip-container',
              {
                'bg-success-400': isSuccess,
                'bg-gray-900 [&_a]:underline': !isSuccess,
              },
            ),
          })}
        >
          <div
            {...getArrowProps({
              className: clsx({
                [tooltipClasses.tooltipArrow]: showArrow,
                'tooltip-arrow': showArrow,
                'text-success-400': isSuccess,
                'text-gray-900': !isSuccess,
              }),
            })}
          />
          <div className="flex w-full max-w-[15.625rem] flex-col items-start">
            {isSuccess ? (
              <div className="flex items-center gap-2 text-base-white">
                <Check size={12} />
                {tooltipContent}
              </div>
            ) : (
              tooltipContent
            )}
          </div>
        </div>
      )}
    </>
  );
};

Tooltip.displayName = displayName;

export default Tooltip;
