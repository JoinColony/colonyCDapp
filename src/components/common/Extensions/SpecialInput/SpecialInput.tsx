import clsx from 'clsx';
import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';

import { type SpecialInputProps } from './types.ts';

import styles from './SpecialInput.module.css';

const displayName = 'common.Extensions.SpecialInput';

const SpecialInput: FC<SpecialInputProps> = ({
  defaultValue,
  name,
  disabled,
  id,
  placeholder,
  isError,
  type,
  step,
  onChange,
}) => {
  const { register } = useFormContext();
  return (
    <div
      className={clsx(styles.wrapper, 'group focus-within:border-blue-100', {
        'hover:after:border-blue-100': !isError,
        'border-none': isError,
        'pointer-events-none opacity-50': disabled,
      })}
    >
      <input
        {...register(name)}
        defaultValue={defaultValue}
        type="number"
        className={`${
          styles.input
        } focus:outline-none group-focus-within:border-blue-200 group-hover:border-blue-200 ${
          isError ? '!border-negative-400' : 'border-gray-300'
        }`}
        id={id}
        placeholder={placeholder}
        aria-disabled={disabled}
        disabled={disabled}
        step={step}
        // Stop value changing on scroll, which is generally an inadvertant side effect of scrolling the page
        onWheel={(e) => e.currentTarget.blur()}
        onChange={onChange}
      />
      <span
        className={`${
          styles.field
        } group-focus-within:border-blue-200 group-hover:border-blue-200 ${
          isError ? '!border-negative-400' : 'border-gray-300'
        }`}
      >
        {type === 'hours' ? formatText({ id: 'hours' }) : '%'}
      </span>
    </div>
  );
};
SpecialInput.displayName = displayName;

export default SpecialInput;
