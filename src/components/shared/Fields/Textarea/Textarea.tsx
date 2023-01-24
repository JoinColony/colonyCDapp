import React, { ReactNode, useState } from 'react'; // RefObject
import { MessageDescriptor, useIntl } from 'react-intl';
import cx from 'classnames';
import { nanoid } from 'nanoid';
import { useFormContext } from 'react-hook-form';

import { SimpleMessageValues } from '~types';
import { getMainClasses } from '~utils/css';

import styles from './Textarea.css';

import InputLabel from '../InputLabel';
import InputStatus from '../InputStatus';

export interface Appearance {
  theme?: 'fat';
  align?: 'right';
  layout?: 'inline';
  resizable?: 'both' | 'horizontal' | 'vertical';
  direction?: 'horizontal';
  colorSchema?: 'dark' | 'transparent' | 'grey';
  size?: 'small';
}

export interface Props {
  /** Appearance object */
  appearance?: Appearance;
  /** Should textarea be displayed alone, or with label & status? */
  elementOnly?: boolean;
  /** Extra node to render on the top right in the label */
  extra?: ReactNode;
  /** Help text */
  help?: string | MessageDescriptor;
  /** Help text values for intl interpolation */
  helpValues?: SimpleMessageValues;
  /** Input label text */
  label: string | MessageDescriptor;
  /** Input label values for intl interpolation */
  labelValues?: SimpleMessageValues;
  /** Maximum length (will show counter) */
  maxLength?: number;
  /** Textarea field name (form variable) */
  name: string;
  /** Placeholder text */
  placeholder?: string | MessageDescriptor;
  /** Placeholder text values for intl interpolation */
  placeholderValues?: SimpleMessageValues;
  /** Status text */
  status?: string | MessageDescriptor;
  /** Status text values for intl interpolation */
  statusValues?: SimpleMessageValues;
  /** Disabled status of Textarea */
  disabled?: boolean;
  /** Testing */
  dataTest?: string;
}

const displayName = 'Textarea';

const Textarea = ({
  appearance = {},
  elementOnly = false,
  extra,
  help,
  helpValues,
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
}: Props) => {
  const { formatMessage } = useIntl();
  const [inputId] = useState(nanoid());
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();
  const textareaValue = watch(name);
  const length = textareaValue ? textareaValue.length : 0;
  const placeholder =
    typeof placeholderProp === 'object'
      ? formatMessage(placeholderProp, placeholderValues)
      : placeholderProp;

  return (
    <div className={styles.container}>
      <InputLabel
        appearance={appearance}
        extra={extra}
        help={help}
        helpValues={helpValues}
        inputId={inputId}
        label={label}
        labelValues={labelValues}
        screenReaderOnly={elementOnly}
      />
      <div className={styles.textareaWrapper}>
        <textarea
          {...register(name)}
          aria-invalid={errors[name] ? true : undefined}
          className={getMainClasses(appearance, styles)}
          id={inputId}
          maxLength={maxLength}
          placeholder={placeholder}
          aria-disabled={disabled}
          disabled={disabled}
          data-test={dataTest}
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
          error={errors[name]}
        />
      )}
    </div>
  );
};

Textarea.displayName = displayName;

export default Textarea;
