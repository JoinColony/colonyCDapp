import clsx from 'clsx';
import React, {
  forwardRef,
  type ChangeEventHandler,
  type KeyboardEventHandler,
} from 'react';

interface InputGroupProps {
  className?: string;
  value?: number;
  placeholder: string;
  name: string;
  min?: number;
  max?: number;
  step?: number;
  type?: string;
  isError?: boolean;
  isDisabled?: boolean;
  errorMessage?: string;
  appendMessage?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
}

export const InputGroup = forwardRef<HTMLInputElement, InputGroupProps>(
  (
    {
      className,
      isError,
      isDisabled,
      errorMessage,
      appendMessage,
      name,
      value,
      min,
      max,
      step,
      placeholder,
      type,
      onChange,
      onKeyDown,
    },
    ref,
  ) => {
    return (
      <div className={className}>
        <div
          className={clsx(
            `mt-2 w-fit divide-x rounded border border-gray-300 text-md text-gray-600 focus-within:border-blue-400`,
            {
              'divide-negative-400 !border-negative-400':
                isError && !isDisabled,
              'pointer-events-none': isDisabled,
            },
          )}
        >
          <input
            ref={ref}
            name={name}
            value={value}
            min={min}
            max={max}
            step={step}
            placeholder={placeholder}
            type={type}
            disabled={isDisabled}
            onChange={onChange}
            onKeyDown={onKeyDown}
            className="w-16 bg-transparent py-3 pl-[14px] pr-3 outline-0 placeholder:text-gray-400 disabled:text-gray-300"
          />
          <span
            className={clsx('inline-block h-full py-3 pl-[14px] pr-3', {
              'text-gray-300': isDisabled,
            })}
          >
            {appendMessage}
          </span>
        </div>
        {isError && !isDisabled && (
          <p className="mt-1 text-xs text-negative-400">{errorMessage}</p>
        )}
      </div>
    );
  },
);
