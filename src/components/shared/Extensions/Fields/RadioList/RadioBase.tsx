import React, { FC } from 'react';
import clsx from 'clsx';
import styles from './RadioList.module.css';
import { RadioBaseProps } from './types';

const displayName = 'common.Extensions.RadioList';

const RadioBase: FC<RadioBaseProps> = ({ defaultValue, name, disabled, id, isError, label }) => {
  return (
    // We don't need id for this label because input is inside of it
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      className={clsx(
        'flex items-center group border border-gray-300 rounded-lg px-6 py-3 text-md font-normal cursor-pointer',
        {
          'pointer-events-none opacity-50': disabled,
        }
      )}
    >
      {label}
      <input
        defaultValue={defaultValue}
        name={name}
        type="radio"
        className={`${styles.field} w-[3.75rem] rounded-l pr-4 pl-3 border 
          group-hover:border-blue-200 group-focus-within:border-blue-200 ${
            isError ? 'border-negative-400' : 'border-gray-300'
          } ${disabled && 'cursor-not-allowed opacity-50 group-hover:border-gray-300'}`}
        id={id}
        aria-disabled={disabled}
        disabled={disabled}
      />
    </label>
  );
};

RadioBase.displayName = displayName;

export default RadioBase;
