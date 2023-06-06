/* eslint-disable max-len */
import React, { FC } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';
import { CheckboxProps } from './types';
import styles from './Checkbox.module.css';

const Checkbox: FC<CheckboxProps> = ({ name, disabled, id, register, label, onChange, classNames }) => {
  const { formatMessage } = useIntl();

  return (
    <div className={clsx(classNames, 'flex items-center')}>
      <div className="relative h-4 w-4 mr-2 shrink-0">
        <input
          type="checkbox"
          {...register?.(name)}
          name={name}
          id={id}
          disabled={disabled}
          onChange={onChange}
          className="peer appearance-none relative z-[1]"
        />
        <span
          className={clsx(
            styles.checkboxBox,
            'peer-checked:bg-blue-300 peer-checked:border-blue-300 peer-disabled:bg-gray-50 peer-disabled:border-gray-50',
          )}
        />
      </div>
      <label
        htmlFor={id}
        className={clsx('text-gray-700 text-md', {
          'cursor-pointer': !disabled,
        })}
      >
        {formatMessage(label)}
      </label>
    </div>
  );
};

export default Checkbox;
