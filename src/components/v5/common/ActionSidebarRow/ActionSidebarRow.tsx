import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import { ActionSidebarRowProps } from './types';
import Icon from '~shared/Icon';

const ActionSidebarRow: FC<PropsWithChildren<ActionSidebarRowProps>> = ({
  iconName,
  title,
  children,
  isDescriptionFieldRow = false,
  isOpened,
  onToggle,
  ref,
  isError,
}) => {
  const { formatMessage } = useIntl();

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
      {children}
    </div>
  );
};

export default ActionSidebarRow;
