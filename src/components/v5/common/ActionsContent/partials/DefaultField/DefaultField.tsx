import React, { FC } from 'react';
import { useController } from 'react-hook-form';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import styles from './DefaultField.module.css';
import { DefaultFieldProps } from './types';

const displayName = 'v5.common.ActionsContent.partials.DefaultField';

const DefaultField: FC<DefaultFieldProps> = ({
  name,
  placeholder,
  isErrors,
}) => {
  const { field } = useController({
    name,
  });
  const { formatMessage } = useIntl();

  return (
    <div className="sm:relative w-full">
      <input
        type="text"
        id={name}
        placeholder={formatMessage(placeholder)}
        className={clsx(styles.input, {
          'text-gray-900': !isErrors,
          'text-negative-400': isErrors,
        })}
        {...field}
      />
    </div>
  );
};

DefaultField.displayName = displayName;

export default DefaultField;
