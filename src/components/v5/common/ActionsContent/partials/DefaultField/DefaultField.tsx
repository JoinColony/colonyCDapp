import React, { FC } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import styles from './DefaultField.module.css';
import { DefaultFieldProps } from './types';
import { MAX_COLONY_DISPLAY_NAME } from '~constants';

const displayName = 'v5.common.ActionsContent.partials.DefaultField';

const DefaultField: FC<DefaultFieldProps> = ({
  name,
  placeholder,
  defaultValue,
  isError,
  maxLength = MAX_COLONY_DISPLAY_NAME,
  defaultValue,
}) => {
  const { field } = useController({
    name,
    defaultValue: defaultValue || '',
  });
  const methods = useFormContext();
  const { formatMessage } = useIntl();

  const isDirty = methods?.formState?.isDirty;

  return (
    <div className="sm:relative w-full">
      <input
        type="text"
        id={name}
        placeholder={formatMessage(placeholder)}
        className={clsx(styles.input, 'text-gray-900', {
          'placeholder-gray-500': !isError,
          'placeholder-negative-400': isError,
        })}
        {...field}
      />
      {isDirty && isError && (
        <div
          className={clsx('text-xs flex justify-end', {
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
