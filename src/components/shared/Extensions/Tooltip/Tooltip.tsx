import { Check } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, {
  useState,
  type FC,
  type PropsWithChildren,
  useEffect,
} from 'react';
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
  isError = false,
  isCopyTooltip,
  className,
  selectTriggerRef = (v) => v,
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    triggerRef,
    tooltipRef,
    visible,
  } = usePopperTooltip(
    {
      delayShow: 200,
      placement,
      trigger: tooltipContent ? trigger : null,
      visible: isCopyTooltip ? isTooltipVisible : isOpen,
      delayHide: interactive ? 200 : 0,
      interactive,
      offset,
    },
    popperOptions,
  );

  useEffect(() => {
    if (isOpen !== undefined && isCopyTooltip) {
      setIsTooltipVisible(isOpen);
    }
  }, [isOpen, setIsTooltipVisible, isCopyTooltip]);

  useEffect(() => {
    if (isCopyTooltip) {
      const handleClickOutside = (event: MouseEvent) => {
        const isOutsideTooltip =
          tooltipRef && !tooltipRef.contains(event.target as Node);

        if (isOutsideTooltip) {
          setIsTooltipVisible(false);
        }
      };

      const handleMouseMove = (event: MouseEvent) => {
        const isOutsideTrigger =
          triggerRef && !triggerRef.contains(event.target as Node);

        if (isOutsideTrigger) {
          setIsTooltipVisible(false);
        }
      };

      if (visible) {
        document.addEventListener('click', handleClickOutside);
        document.addEventListener('mousemove', handleMouseMove);
      } else {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('mousemove', handleMouseMove);
      }

      return () => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('mousemove', handleMouseMove);
      };
    }

    return undefined;
  }, [tooltipRef, triggerRef, visible, setIsTooltipVisible, isCopyTooltip]);

  return (
    <>
      <div
        className={clsx(className, 'flex')}
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
                'bg-negative-400': isError,
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
                'text-negative-400': isError,
                'text-gray-900': !isSuccess,
              }),
            })}
          />
          <div className="flex max-w-[15.625rem] flex-col items-start">
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
