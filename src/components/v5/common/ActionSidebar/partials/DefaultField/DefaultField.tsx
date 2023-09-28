import React, { FC } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import clsx from 'clsx';

import styles from './DefaultField.module.css';
import { DefaultFieldProps } from './types';
import { MAX_COLONY_DISPLAY_NAME } from '~constants';

const displayName = 'v5.common.ActionsContent.partials.DefaultField';

const DefaultField: FC<DefaultFieldProps> = ({
  name,
  placeholder,
  defaultValue,
  maxLength = MAX_COLONY_DISPLAY_NAME,
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    defaultValue: defaultValue || '',
  });
  const isError = !!error;
  const methods = useFormContext();
  const isDirty = methods?.formState?.isDirty;

  return (
    <div className="sm:relative w-full flex justify-between">
      <input
        type="text"
        id={name}
        className={clsx(styles.input, 'text-gray-900', {
          'placeholder-gray-500': !isError,
          'placeholder-negative-400': isError,
        })}
        {...{ placeholder }}
        {...field}
      />
      {isDirty && isError && (
        <div
          className={clsx('text-xs shrink-0 ml-auto absolute right-0 top-5', {
            'text-neutral-400': !isError,
            'text-negative-400': isError,
          })}
        >
          {field.value.length} / {maxLength}
        </div>
      )}
    </div>
  );
};

DefaultField.displayName = displayName;

export default DefaultField;
