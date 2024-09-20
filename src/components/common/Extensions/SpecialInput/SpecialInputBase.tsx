import clsx from 'clsx';
import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';

import { type SpecialInputProps } from './types.ts';

const displayName = 'common.Extensions.SpecialInputBase';

const SpecialInputBase: FC<SpecialInputProps> = ({
  defaultValue,
  name,
  disabled,
  id,
  placeholder,
  isError,
  type,
  step,
  onChange,
  value,
  min,
  ...rest
}) => {
  return (
    <div
      className={clsx(
        'group relative flex justify-end text-md after:absolute after:-left-[0.1875rem] after:-top-[0.1875rem] after:block after:h-[calc(100%+0.1875rem+0.1875rem)] after:w-[calc(100%+0.1875rem+0.1875rem)] after:rounded-lg after:border-[0.1875rem] after:border-transparent after:transition-all after:duration-normal after:content-[""] focus-within:border-blue-100',
        {
          'hover:after:border-blue-100': !isError,
          'border-none': isError,
          'pointer-events-none opacity-50': disabled,
        },
      )}
    >
      <input
        {...rest}
        name={name}
        defaultValue={defaultValue}
        type="number"
        className={clsx(
          'z-base -mr-px w-[3.75rem] shrink-0 flex-grow rounded-l rounded-r-none border bg-base-white px-3.5 py-3 transition-colors duration-normal focus:outline-none group-focus-within:border-blue-200 group-hover:border-blue-200',
          {
            'border-gray-300': !isError,
            '!border-negative-400': isError,
          },
        )}
        id={id}
        placeholder={placeholder}
        aria-disabled={disabled}
        disabled={disabled}
        step={step}
        min={min}
        // Stop value changing on scroll, which is generally an inadvertant side effect of scrolling the page
        onWheel={(e) => e.currentTarget.blur()}
        onChange={onChange}
        value={value}
      />
      <span
        className={clsx(
          'z-base min-w-[2.375rem] max-w-[4.125rem] rounded-l-none rounded-r border py-3 pl-3.5 pr-3 text-center text-gray-600 transition-all duration-normal',
          {
            'border-gray-300': !isError,
            '!border-negative-400': isError,
          },
        )}
      >
        {type === 'hours' && formatText({ id: 'hours' })}
        {type === 'percent' && '%'}
        {type === 'days' && formatText({ id: 'days' })}
      </span>
    </div>
  );
};
SpecialInputBase.displayName = displayName;

export default SpecialInputBase;
