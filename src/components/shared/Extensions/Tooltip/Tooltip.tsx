import { Check } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { usePageThemeContext } from '~context/PageThemeContext/PageThemeContext.ts';
import { useMobile } from '~hooks';

import tooltipClasses from './Tooltip.styles.ts';
import { type TooltipProps } from './types.ts';

const displayName = 'Extensions.Tooltip';

const Tooltip: FC<PropsWithChildren<TooltipProps>> = ({
  children,
  tooltipContent,
  tooltipStyle,
  placement = 'auto',
  popperOptions,
  interactive,
  offset = [0, 12],
  showArrow = true,
  trigger = 'hover',
  isOpen,
  isSuccess = false,
  isError = false,
  isFullWidthContent,
  testId,
  className,
  contentWrapperClassName,
  selectTriggerRef = (v) => v,
}) => {
  const isMobile = useMobile();
  const tooltipTrigger = isMobile ? 'click' : trigger;
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
      trigger: tooltipContent ? tooltipTrigger : null,
      visible: isOpen,
      delayHide: interactive ? 200 : 0,
      interactive,
      offset,
    },
    popperOptions,
  );
  const { isDarkMode } = usePageThemeContext();

  return (
    <>
      <div
        className={clsx(className, 'flex', {
          'w-full': isFullWidthContent,
        })}
        ref={(ref) => {
          setTriggerRef(selectTriggerRef(ref));
        }}
        data-testid={testId}
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
            style: tooltipStyle,
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
          <div
            className={clsx(
              contentWrapperClassName,
              'flex w-full max-w-[15.625rem] flex-col items-start whitespace-pre-wrap',
            )}
          >
            {isSuccess ? (
              <div
                className={clsx('flex items-center gap-2', {
                  'text-base-white': !isDarkMode,
                  'text-gray-900': isDarkMode,
                })}
              >
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
