import React, { TextareaHTMLAttributes, useState } from 'react';
import cx from 'classnames';
import { nanoid } from 'nanoid';
import { useFormContext } from 'react-hook-form';

import { CoreInputProps } from '~shared/Fields/Input';

import { getMainClasses } from '~utils/css';
import { formatText } from '~utils/intl';

import InputLabel from '../InputLabel';
import InputStatus from '../InputStatus';

import styles from './Textarea.css';

export interface Appearance {
  theme?: 'fat';
  align?: 'right';
  layout?: 'inline';
  resizable?: 'both' | 'horizontal' | 'vertical';
  direction?: 'horizontal';
  colorSchema?: 'dark' | 'transparent' | 'grey';
  size?: 'small';
}

export interface Props
  extends CoreInputProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name' | 'placeholder'> {
  /** Appearance object */
  appearance?: Appearance;
}

const displayName = 'Textarea';

const Textarea = ({
  appearance = {},
  elementOnly = false,
  extra,
  help,
  helpValues,
  id: idProp,
  label,
  labelValues,
  maxLength = undefined,
  name,
  placeholder: placeholderProp,
  placeholderValues,
  status,
  statusValues,
  disabled,
  dataTest,
  ...textAreaProps
}: Props) => {
  const [id] = useState(idProp || nanoid());
  const { register, watch, getFieldState } = useFormContext();
  const value = watch(name);
  const { error } = getFieldState(name);
  const length = value?.length || 0;

  const placeholder = placeholderProp
    ? formatText(placeholderProp, placeholderValues)
    : undefined;

  return (
    <div className={styles.container}>
      {!elementOnly && label && (
        <InputLabel
          appearance={appearance}
          extra={extra}
          help={help}
          helpValues={helpValues}
          inputId={id}
          label={label}
          labelValues={labelValues}
          screenReaderOnly={elementOnly}
        />
      )}
      <div className={styles.textareaWrapper}>
        <textarea
          {...register(name)}
          aria-invalid={error ? true : undefined}
          className={getMainClasses(appearance, styles)}
          id={id}
          maxLength={maxLength}
          placeholder={placeholder}
          aria-disabled={disabled}
          disabled={disabled}
          data-test={dataTest}
          {...textAreaProps}
        />
        {maxLength && (
          <span
            className={cx(styles.count, {
              [styles.limit]: length === maxLength,
            })}
          >
            {length}/{maxLength}
          </span>
        )}
      </div>
      {!elementOnly && (
        <InputStatus
          appearance={appearance}
          status={status}
          statusValues={statusValues}
          error={error?.message}
        />
      )}
    </div>
  );
};

Textarea.displayName = displayName;

export default Textarea;
