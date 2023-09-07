import React, { PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import { ActionSidebarRowProps } from './types';
import Icon from '~shared/Icon';
import { useActionSidebarRow } from './hooks';
import Tooltip from '~shared/Extensions/Tooltip';

const ActionSidebarRow = React.forwardRef<
  HTMLDivElement,
  PropsWithChildren<ActionSidebarRowProps>
>(
  (
    {
      iconName,
      title,
      children,
      isDescriptionFieldRow = false,
      isOpened,
      onToggle,
      isError,
      fieldName,
    },
    ref,
  ) => {
    const { formatMessage } = useIntl();
    const fieldToolTips = useActionSidebarRow();
    const content = (
      <>
        <Icon name={iconName} appearance={{ size: 'extraTiny' }} />
        <span className="text-md ml-2 min-w-[11.25rem] flex gap-4 items-center">
          {formatMessage(title)}
          {isDescriptionFieldRow && (
            <span
              className={clsx(
                'flex text-gray-400 transition-all duration-normal group-hover:text-blue-400',
                {
                  'rotate-90': isOpened,
                },
              )}
            >
              <Icon name="caret-right" appearance={{ size: 'extraTiny' }} />
            </span>
          )}
        </span>
      </>
    );

    return (
      <div
        className={clsx('flex  gap-2 relative mb-3 last:mb-0', {
          'flex-col': isDescriptionFieldRow && isOpened,
          'items-center': !isDescriptionFieldRow,
        })}
        ref={ref}
      >
        <Tooltip
          tooltipContent={
            <span>{formatMessage({ id: `${fieldToolTips[fieldName]}` })}</span>
          }
          placement="bottom-start"
        >
          {isDescriptionFieldRow ? (
            <button
              className={clsx('flex items-center  group', {
                'hover:text-blue-400': isDescriptionFieldRow,
                'text-negative-400': isError,
                'text-gray-600': !isError,
              })}
              onClick={onToggle}
              type="button"
              aria-expanded={isOpened}
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
          )}
        </Tooltip>
        {children}
      </div>
    );
  },
);

export default ActionSidebarRow;
