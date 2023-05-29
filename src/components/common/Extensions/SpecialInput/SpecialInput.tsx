import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import styles from './SpecialInput.module.css';
import { SpecialInputProps } from './types';

const displayName = 'common.Extensions.SpecialInput';

const SpecialInput: FC<SpecialInputProps> = ({
  min = 1,
  max = 8765,
  defaultValue,
  name,
  disabled,
  id,
  placeholder,
  register,
  isError,
  type,
}) => {
  const { formatMessage } = useIntl();
  return (
    <div className="flex group justify-end font-normal text-gray-900 text-md">
      <input
        defaultValue={defaultValue}
        {...register(type)}
        name={name}
        type="number"
        min={min}
        max={max}
        className={`${styles.input} group-hover:border-blue-200 group-focus-within:border-blue-200 ${
          isError ? 'border-negative-400' : 'border-gray-300'
        } ${disabled && 'pointer-events-none opacity-50 group-hover:border-gray-300'}`}
        id={id}
        placeholder={placeholder}
        aria-disabled={disabled}
        disabled={disabled}
      />
      <div
        className={`${styles.field} group-focus-within:border-blue-200 group-hover:border-blue-200 ${
          isError ? 'border-negative-400' : 'border-gray-300'
        } ${disabled && 'pointer-events-none opacity-50 group-hover:border-gray-300'}`}
      >
        {type === 'hour' ? formatMessage({ id: 'hours' }) : '%'}
      </div>
    </div>
  );
};
SpecialInput.displayName = displayName;

export default SpecialInput;
