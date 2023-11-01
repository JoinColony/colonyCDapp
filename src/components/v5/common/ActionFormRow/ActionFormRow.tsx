import React from 'react';
import clsx from 'clsx';

import { useController } from 'react-hook-form';
import { ActionFormRowProps } from './types';
import Icon from '~shared/Icon';
import Tooltip from '~shared/Extensions/Tooltip';
import useToggle from '~hooks/useToggle';
import { LABEL_CLASSNAME } from './consts';

const ActionSidebarRow = React.forwardRef<HTMLDivElement, ActionFormRowProps>(
  (
    {
      iconName,
      title,
      children,
      isExpandable = false,
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
            'text-gray-400': !isError,
          })}
        />
        <span
          className={clsx(
            LABEL_CLASSNAME,
            'text-md ml-2 flex gap-4 items-center',
          )}
        >
          {title}
          {isExpandable && (
            <span
              className={clsx(
                'flex text-gray-400 transition-all duration-normal group-hover:text-blue-400',
                {
                  'rotate-90': isExpanded,
                },
              )}
            >
              <Icon name="caret-right" appearance={{ size: 'extraTiny' }} />
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
        className={clsx(className, 'flex gap-2 relative mb-3 last:mb-0', {
          'flex-col': isExpandable && isExpanded,
          'items-center': !isExpandable,
        })}
        ref={ref}
      >
        <div className="basis-1/3">
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
              placement="bottom-start"
            >
              {tooltipContent}
            </Tooltip>
          ) : (
            tooltipContent
          )}
        </div>
        <div className="basis-2/3">
          {contentTooltip ? (
            <Tooltip
              placement="bottom-start"
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

export default ActionSidebarRow;
