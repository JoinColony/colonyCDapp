import clsx from 'clsx';
import React, { type ChangeEventHandler, type FC } from 'react';

interface InputGroupProps {
  className?: string;
  value: string | number;
  placeholder: string;
  min?: number;
  max?: number;
  type?: string;
  isError?: boolean;
  errorMessage?: string;
  appendMessage?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export const InputGroup: FC<InputGroupProps> = ({
  className,
  value,
  isError,
  errorMessage,
  appendMessage,
  ...rest
}) => {
  return (
    <div className={className}>
      <div
        className={clsx(
          `mt-2 w-fit divide-x rounded border border-gray-300 text-gray-600 focus-within:border-blue-400`,
          {
            'divide-negative-400 !border-negative-400': isError,
          },
        )}
      >
        <input
          {...rest}
          value={value?.toString()}
          className="w-16 bg-transparent py-3 pl-4 pr-3 outline-0 placeholder:text-gray-400"
        />
        <span className="inline-block h-full py-3 pl-4 pr-3">
          {appendMessage}
        </span>
      </div>
      {isError && (
        <p className="mt-1 text-xs text-negative-400">{errorMessage}</p>
      )}
    </div>
  );
};
