import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import styles from './SpecialHourInput.module.css';
import { SpecialHourInputProps } from './types';

const displayName = 'common.Extensions.SpecialHourInput';

const SpecialHourInput: FC<SpecialHourInputProps> = ({
  min = 1,
  max = 8765,
  defaultValue,
  name,
  disabled,
  id,
  placeholder,
  register,
  isError,
}) => {
  const { formatMessage } = useIntl();
  return (
    <div className="flex group" role="button" tabIndex={0}>
      <input
        defaultValue={defaultValue}
        {...register(name)}
        name={name}
        type="number"
        min={min}
        max={max}
        className={`${styles.field} w-[3.75rem] rounded-l pr-4 pl-3 border 
          group-hover:border-blue-200 group-focus-within:border-blue-200 ${
            isError ? 'border-negative-400' : 'border-gray-300'
          } ${disabled && 'cursor-not-allowed opacity-50 group-hover:border-gray-300'}`}
        id={id}
        placeholder={placeholder}
        aria-disabled={disabled}
        disabled={disabled}
      />
      <div
        className={`${styles.field} rounded-r pl-3 pr-3 border-l-0 border-y border-r group-focus-within:border-blue-200
        group-hover:border-blue-200 ${isError ? 'border-negative-400' : 'border-gray-300'} ${
          disabled && 'cursor-not-allowed opacity-50 group-hover:border-gray-300'
        }`}
      >
        {formatMessage({ id: 'hours' })}
      </div>
    </div>
  );
};
SpecialHourInput.displayName = displayName;

export default SpecialHourInput;
