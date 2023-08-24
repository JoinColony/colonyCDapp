import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useIntl } from 'react-intl';

import styles from './DefaultField.module.css';
import { DefaultFieldProps } from './types';

const displayName = 'v5.common.ActionsContent.partials.DefaultField';

const DefaultField: FC<DefaultFieldProps> = ({ name, placeholder }) => {
  const method = useFormContext();
  const { formatMessage } = useIntl();

  return (
    <div className="sm:relative w-full">
      <input
        type="text"
        {...method?.register(name)}
        name={name}
        id={name}
        placeholder={formatMessage(placeholder)}
        className={styles.input}
      />
    </div>
  );
};

DefaultField.displayName = displayName;

export default DefaultField;
