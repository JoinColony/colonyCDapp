import React, { FC, PropsWithChildren } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import clsx from 'clsx';

import Icon from '~shared/Icon';
import styles from './Tooltip.module.css';
import { TooltipProps } from './types';

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
              styles.tooltipContainer,
              'tooltip-container text-base-white relative text-3 p-3',
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
                [styles.tooltipArrow]: showArrow,
                'tooltip-arrow': showArrow,
                'text-success-400': isSuccess,
                'text-gray-900': !isSuccess,
              }),
            })}
          />
          <div className="max-w-[15.625rem] flex flex-col items-start">
            {isSuccess ? (
              <div className="flex items-center text-base-white gap-2">
                <Icon name="check" appearance={{ size: 'extraTiny' }} />
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
