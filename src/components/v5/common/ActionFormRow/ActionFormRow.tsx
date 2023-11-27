import React from 'react';
import clsx from 'clsx';

import { useController } from 'react-hook-form';
import { ActionFormRowProps } from './types';
import Icon from '~shared/Icon';
import Tooltip from '~shared/Extensions/Tooltip';
import useToggle from '~hooks/useToggle';
import { LABEL_CLASSNAME } from './consts';

const ActionFormRow = React.forwardRef<HTMLDivElement, ActionFormRowProps>(
  (
    {
      iconName,
      title,
      children,
      isExpandable = false,
      isMultiLine = false,
      fieldName,
      tooltips = {},
      className,
    },
    ref,
  ) => {
    const {
      fieldState: { error },
    } = useController({ name: fieldName || '' });
    const rowToggle = useToggle();
    const [isExpanded, { toggle }] = rowToggle;
    const isError = !!error;
    const { label, content: contentTooltip } = tooltips;

    const rowContent =
      typeof children === 'function' ? children(rowToggle) : children;

    const content = (
      <>
        <Icon
          name={iconName}
          appearance={{ size: 'extraTiny' }}
          className={clsx('h-3 w-3', {
            'text-negative-400': isError,
            'text-gray-900': !isError,
          })}
        />
        <span
          className={clsx(
            LABEL_CLASSNAME,
            'text-md ml-2 text-gray-900 flex gap-2 items-center',
          )}
        >
          {title}
          {isExpandable && (
            <span
              className={clsx(
                'flex text-gray-900 transition-all duration-normal group-hover:text-blue-400',
                {
                  'rotate-90': isExpanded,
                },
              )}
            >
              <Icon
                name="caret-right"
                appearance={{ size: 'extraExtraTiny' }}
              />
            </span>
          )}
        </span>
      </>
    );

    const tooltipContent = isExpandable ? (
      <button
        className={clsx('flex items-center group', {
          'hover:text-blue-400': isExpandable,
          'text-negative-400': isError,
          'text-gray-600': !isError,
        })}
        onClick={toggle}
        type="button"
        aria-expanded={isExpanded}
      >
        {content}
      </button>
    ) : (
      <div
        className={clsx('flex items-center', {
          'text-negative-400': isError,
          'text-gray-600': !isError,
        })}
      >
        {content}
      </div>
    );

    return (
      <div
        className={clsx(
          className,
          'flex gap-2 min-h-[1.875rem] justify-center relative mb-3 last:mb-0 ',
          {
            'flex-col items-start': isExpandable && isExpanded,
            'items-start pt-[0.35rem]': isMultiLine || isExpandable,
            'items-center': !isExpandable && !isMultiLine && !isExpanded,
          },
        )}
        ref={ref}
      >
        <div
          className={clsx(className, 'w-[10rem] sm:w-[12.5rem] flex-shrink-0', {
            'min-h-[1.875rem]': isExpandable && isExpanded,
          })}
        >
          {label ? (
            <Tooltip
              {...label}
              tooltipContent={<span>{label.tooltipContent}</span>}
              selectTriggerRef={(triggerRef) => {
                if (!triggerRef) {
                  return null;
                }

                return triggerRef.querySelector(`.${LABEL_CLASSNAME}`);
              }}
              placement="top"
            >
              {tooltipContent}
            </Tooltip>
          ) : (
            tooltipContent
          )}
        </div>
        <div className="flex flex-grow items-center">
          {contentTooltip ? (
            <Tooltip
              placement="top"
              {...contentTooltip}
              tooltipContent={<span>{contentTooltip.tooltipContent}</span>}
            >
              {rowContent}
            </Tooltip>
          ) : (
            rowContent
          )}
        </div>
      </div>
    );
  },
);

export default ActionFormRow;
