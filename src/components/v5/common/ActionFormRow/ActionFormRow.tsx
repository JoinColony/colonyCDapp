import React from 'react';
import clsx from 'clsx';

import { useController } from 'react-hook-form';
import { ActionFormRowProps } from './types';
import Icon from '~shared/Icon';
import Tooltip from '~shared/Extensions/Tooltip';
import useToggle from '~hooks/useToggle';

const ActionSidebarRow = React.forwardRef<HTMLDivElement, ActionFormRowProps>(
  (
    { iconName, title, children, isExpandable = false, fieldName, tooltip },
    ref,
  ) => {
    const {
      fieldState: { error },
    } = useController({ name: fieldName || '' });
    const rowToggle = useToggle();
    const [isExpanded, { toggle }] = rowToggle;
    const isError = !!error;

    const content = (
      <>
        <Icon name={iconName} appearance={{ size: 'extraTiny' }} />
        <span className="text-md ml-2 min-w-[11.25rem] flex gap-4 items-center">
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
        className={clsx('flex items-center  group', {
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
        className={clsx('flex  gap-2 relative mb-3 last:mb-0', {
          'flex-col': isExpandable && isExpanded,
          'items-center': !isExpandable,
        })}
        ref={ref}
      >
        {tooltip ? (
          <Tooltip
            tooltipContent={<span>{tooltip}</span>}
            placement="bottom-start"
          >
            {tooltipContent}
          </Tooltip>
        ) : (
          tooltipContent
        )}
        {typeof children === 'function' ? children(rowToggle) : children}
      </div>
    );
  },
);

export default ActionSidebarRow;
