import { CaretRight } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';
import { useController } from 'react-hook-form';

import useToggle from '~hooks/useToggle/index.ts';
import Tooltip from '~shared/Extensions/Tooltip/index.ts';

import { LABEL_CLASSNAME } from './consts.ts';
import { type ActionFormRowProps } from './types.ts';

const ActionFormRow = <T,>(
  {
    icon: Icon,
    title,
    children,
    isExpandable = false,
    isMultiLine = false,
    fieldName,
    tooltips = {},
    className,
    isDisabled,
  }: ActionFormRowProps<T>,
  ref: React.Ref<HTMLDivElement>,
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
        size={14}
        className={clsx('mt-[0.125rem] sm:mt-0', {
          'text-negative-400': !isDisabled && isError,
          'text-gray-900': !isDisabled && !isError,
          'text-gray-300': isDisabled,
        })}
      />
      <span
        className={clsx(
          LABEL_CLASSNAME,
          {
            'text-negative-400': !isDisabled && isError,
            'text-gray-900': !isDisabled && !isError,
            'text-gray-300': isDisabled,
          },
          'ml-2 flex items-center gap-2 text-md',
        )}
      >
        {title}
        {isExpandable && (
          <span
            className={clsx(
              'flex transition-all duration-normal group-hover:text-blue-400',
              {
                'rotate-90': isExpanded,
                'text-gray-900': !isError && !isDisabled,
                'text-gray-300': !isError && isDisabled,
              },
            )}
          >
            <CaretRight size={10} />
          </span>
        )}
      </span>
    </>
  );

  const tooltipContent = isExpandable ? (
    <button
      className={clsx('group flex items-center', {
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
      className={clsx('flex sm:items-center', {
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
        'relative mb-3 flex min-h-[1.875rem] w-full justify-center gap-2 last:mb-0',
        {
          'flex-col items-start': isExpandable && isExpanded,
          'items-start pt-[0.35rem]': isMultiLine || isExpandable,
          'items-center': !isExpandable && !isMultiLine && !isExpanded,
        },
      )}
      ref={ref}
    >
      <div
        className={clsx(className, 'w-[10rem] flex-shrink-0 sm:w-[12.5rem]', {
          'min-h-[1.875rem]': isExpandable && isExpanded,
        })}
      >
        {label ? (
          <Tooltip
            placement="top"
            {...label}
            tooltipContent={<span>{label.tooltipContent}</span>}
            selectTriggerRef={(triggerRef) => {
              if (!triggerRef) {
                return null;
              }

              return triggerRef.querySelector(`.${LABEL_CLASSNAME}`);
            }}
          >
            {tooltipContent}
          </Tooltip>
        ) : (
          tooltipContent
        )}
      </div>
      <div
        className={clsx('flex items-center', {
          'w-full': isExpanded,
          'w-[calc(100%-10rem-0.5rem)] sm:w-[calc(100%-12.5rem-0.5rem)]':
            !isExpanded,
        })}
      >
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
};

const ForwardedActionFormRow = React.forwardRef(ActionFormRow) as <T>(
  props: ActionFormRowProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => ReturnType<typeof ActionFormRow>;

export default ForwardedActionFormRow;
