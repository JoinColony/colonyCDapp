import { Info } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { formatText } from '~utils/intl.ts';
import ExtensionStatusBadge from '~v5/common/Pills/ExtensionStatusBadge/index.ts';

import { type RadioBaseProps, type RadioItemProps } from './types.ts';

const displayName = 'common.Extensions.Fields.RadioBase';

const RadioBase: FC<RadioBaseProps & PropsWithChildren> = ({
  item,
  isError,
  onChange,
  name,
  checked,
  children,
}) => {
  const { disabled, label, description, value, badge, tooltip } =
    item as RadioItemProps;

  const labelText = formatText(label);

  return (
    <div
      className={clsx(
        'relative w-full after:absolute after:-left-[0.1875rem] after:-top-[0.1875rem] after:block after:h-[calc(100%+0.375rem)] after:w-[calc(100%+0.375rem)] after:rounded-[0.7rem] after:border-[0.1875rem] after:border-transparent after:transition-all after:duration-normal after:content-[""]',
        {
          'hover:after:border-blue-100': !disabled,
          '!gray-300': disabled,
        },
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        id={label}
        aria-disabled={disabled}
        disabled={disabled}
        checked={checked}
        className={clsx('peer/radio hidden', {
          'pointer-events-none': disabled,
        })}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <label
        htmlFor={label}
        className={clsx(
          `relative z-base flex min-h-[2.75rem] cursor-pointer flex-col justify-center rounded-lg 
          border border-gray-300 py-3 pl-[3.25rem] pr-6 text-md transition-all duration-normal 
          before:absolute before:left-6 before:top-[0.875rem] before:h-[1rem] before:w-[1rem] 
          before:rounded-full before:border before:border-gray-200 before:transition-all before:duration-normal 
          after:absolute after:left-6 after:top-[0.875rem] after:h-[0.4375rem] after:w-[0.4375rem] 
          after:translate-x-[calc(50%+1px)] after:translate-y-[calc(50%+1px)] after:rounded-full after:bg-blue-400 
          after:opacity-0 after:transition-all after:duration-normal hover:border-blue-200 
          peer-checked/radio:border-blue-400 peer-checked/radio:before:border-blue-400 
          peer-checked/radio:after:opacity-100 peer-focus/radio:border-blue-200 peer-focus/radio:before:bg-gray-25
          peer-disabled/radio:border-gray-300 
          peer-disabled/radio:before:border-gray-200 
          peer-disabled/radio:after:bg-gray-300 
          peer-checked/radio:peer-disabled/radio:before:border-gray-300`,
          {
            'before:top-4 after:top-4': !!badge,
            '!border-negative-400 after:bg-negative-400 peer-checked/radio:before:border-negative-400':
              isError && checked,
            'pointer-events-none': disabled,
          },
        )}
      >
        <div className={badge && 'flex justify-between gap-2'}>
          <div className="self-center">
            <div className={tooltip && 'inline-flex items-center '}>
              <span
                className={clsx('block', {
                  'text-gray-300': disabled,
                })}
              >
                {labelText}
              </span>
              {tooltip && (
                <div className="ml-2 flex items-center text-gray-400">
                  <Tooltip {...tooltip}>
                    <Info size={12} />
                  </Tooltip>
                </div>
              )}
            </div>
            {description && (
              <span
                className={clsx('mt-1 block text-sm text-gray-600', {
                  '!text-gray-300': disabled,
                })}
              >
                {formatText(description)}
              </span>
            )}
          </div>
          {badge && (
            <div className="flex shrink-0">
              <ExtensionStatusBadge {...badge} />
            </div>
          )}
          {children}
        </div>
      </label>
    </div>
  );
};

RadioBase.displayName = displayName;

export default RadioBase;
