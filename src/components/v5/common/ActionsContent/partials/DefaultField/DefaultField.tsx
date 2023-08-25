import React, { FC } from 'react';
import { useController } from 'react-hook-form';
import { useIntl } from 'react-intl';

import styles from './DefaultField.module.css';
import { DefaultFieldProps } from './types';

const displayName = 'v5.common.ActionsContent.partials.DefaultField';

const DefaultField: FC<DefaultFieldProps> = ({ name, placeholder }) => {
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
        className={styles.input}
        {...field}
      />
    </div>
  );
};

DefaultField.displayName = displayName;

export default DefaultField;
