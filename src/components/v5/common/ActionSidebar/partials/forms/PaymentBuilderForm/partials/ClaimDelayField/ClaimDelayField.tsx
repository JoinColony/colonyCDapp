import {
  formatNumeral,
  registerCursorTracker,
  type FormatNumeralOptions,
  DefaultTimeDelimiter,
} from 'cleave-zen';
import clsx from 'clsx';
import React, { type FC, useMemo, useRef, useEffect } from 'react';
import { useController } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';

import { type ClaimDelayFieldProps } from './types.ts';

const ClaimDelayField: FC<ClaimDelayFieldProps> = ({
  name,
  disabled,
  placeholder,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const formattingOptions: FormatNumeralOptions = useMemo(
    () => ({
      delimiter: ',',
      numeralPositiveOnly: true,
      numeralDecimalScale: 4,
    }),
    [],
  );

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
  });

  useEffect(() => {
    if (!inputRef.current) {
      return undefined;
    }

    return registerCursorTracker({
      input: inputRef.current,
      delimiter: DefaultTimeDelimiter,
    });
  }, [inputRef]);

  const isError = !!error;

  const placeholderValue =
    placeholder ||
    formatText({
      id: 'actionSidebar.enterAmount',
    });

  return (
    <div
      className={clsx(
        className,
        'relative inline-grid items-center gap-3 overflow-hidden bg-base-white text-md before:invisible before:col-start-1 before:row-start-1 before:w-auto before:min-w-[0.5em] before:resize-none before:whitespace-pre-wrap before:text-md before:content-[attr(data-value)]',
      )}
      ref={wrapperRef}
      data-value={field.value || placeholderValue}
    >
      <input
        {...field}
        value={field.value ?? ''}
        ref={inputRef}
        name={name}
        className={clsx(
          'col-start-1 row-start-1 w-auto min-w-[0.5em] flex-shrink resize-none appearance-none bg-base-white text-md outline-none outline-0',
          {
            'text-gray-900 placeholder:text-gray-400': !isError && !disabled,
            'bg-transparent text-gray-400 placeholder:text-gray-300': disabled,
            'text-negative-400 placeholder:text-negative-400':
              !disabled && isError,
          },
        )}
        placeholder={placeholderValue}
        autoComplete="off"
        onChange={(event) => {
          const formattedValue = formatNumeral(
            event.target.value,
            formattingOptions,
          );

          if (
            (!field.value && !formattedValue) ||
            formattedValue === field.value
          ) {
            return;
          }

          if (
            wrapperRef.current &&
            wrapperRef.current.dataset.value !== formattedValue
          ) {
            wrapperRef.current.dataset.value = formattedValue;
          }

          field.onChange(formattedValue);
        }}
        size={1}
        maxLength={11}
      />
      <span
        className={clsx(
          'col-start-2 row-start-1 inline-block text-md text-gray-900',
          {
            'text-gray-900': !isError && !disabled,
            'text-gray-400': disabled,
            'text-negative-400': !disabled && isError,
          },
        )}
      >
        {formatText(
          { id: 'table.column.claimDelayFieldSuffix' },
          {
            hours: parseFloat(field.value) || 0,
          },
        )}
      </span>
    </div>
  );
};

export default ClaimDelayField;
