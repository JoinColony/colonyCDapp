import React, { InputHTMLAttributes, ReactNode, useState } from 'react';
import classnames from 'classnames';
import { CleaveOptions } from 'cleave.js/options';
import { MessageDescriptor, useIntl } from 'react-intl';
import { nanoid } from 'nanoid';
import { useFormContext, UseFormReturn } from 'react-hook-form';

import { Message, SimpleMessageValues } from '~types';

import InputLabel from '../InputLabel';
import InputStatus from '../InputStatus';
import { InputComponentAppearance } from '../Input';

import InputComponentWithoutFormik, {
  InputComponentProps,
} from './InputComponentWithoutFormik';
import styles from './Input.css';

interface MaxButtonParams {
  setValue: UseFormReturn['setValue'];
  maxAmount: string;
  fieldName: string;
}

export interface InputWithoutFormikProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder'> {
  /** Appearance object */
  appearance?: InputComponentAppearance;

  /** Testing */
  dataTest?: string;

  /** Set the input field to a disabled state */
  disabled?: boolean;

  /** Should display the input with the label hidden */
  elementOnly?: boolean;

  /** Add extension of input to the right of it, i.e. for ENS name */
  extensionString?: string | MessageDescriptor;

  /** Extra node to render on the top right in the label */
  extra?: ReactNode;

  /** Options for cleave.js formatting (see [this list](https://github.com/nosir/cleave.js/blob/master/doc/options.md)) */
  formattingOptions?: CleaveOptions;

  /** Help text */
  help?: Message;

  /** Help text values for intl interpolation */
  helpValues?: SimpleMessageValues;

  /** Html `id` for label & input */
  id?: string;

  /** Label text */
  label?: Message;

  /** Label text values for intl interpolation */
  labelValues?: SimpleMessageValues;

  /** Pass params to a max button - implemented only in Cleave options */
  maxButtonParams?: MaxButtonParams;

  /** Input field name (form variable) */
  name: string;

  /** External on change hook */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;

  /** External on change hook */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  /** Placeholder text */
  placeholder?: Message;

  /** Placeholder text values for intl interpolation */
  placeholderValues?: SimpleMessageValues;

  /** Status text */
  status?: Message;

  /** Status text values for intl interpolation */
  statusValues?: SimpleMessageValues;
}

const InputWithoutFormik = <T extends Record<string, any>>({
  appearance = {},
  dataTest,
  disabled,
  elementOnly,
  extensionString,
  extra,
  formattingOptions,
  help,
  helpValues,
  id: idProp,
  label,
  labelValues,
  maxLength,
  maxButtonParams,
  name,
  onChange,
  onBlur,
  placeholder: placeholderProp,
  placeholderValues,
  status,
  statusValues,
}: InputWithoutFormikProps) => {
  const [id] = useState(idProp || nanoid());
  const { formatMessage } = useIntl();
  const {
    formState: { errors, touchedFields },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;
  const touched = touchedFields[name];
  const placeholder =
    typeof placeholderProp === 'object'
      ? formatMessage(placeholderProp, placeholderValues)
      : placeholderProp;

  const inputProps: InputComponentProps<T> = {
    appearance,
    'aria-invalid': !!error && touched,
    formattingOptions,
    id,
    name,
    placeholder,
    disabled,
    maxLength,
    maxButtonParams,
    dataTest,
    onBlur,
    onChange,
  };

  const extensionStringText: string | undefined =
    !extensionString || typeof extensionString === 'string'
      ? extensionString
      : formatMessage(extensionString);

  const containerClasses = classnames(styles.container, {
    [styles.containerHorizontal]: appearance.direction === 'horizontal',
  });
  return (
    <div className={containerClasses}>
      {label && (
        <InputLabel
          appearance={appearance}
          inputId={id}
          label={label}
          labelValues={labelValues}
          help={help}
          helpValues={helpValues}
          extra={extra}
          screenReaderOnly={elementOnly}
        />
      )}
      <div className={styles.extensionContainer}>
        <InputComponentWithoutFormik {...inputProps} />
        {extensionStringText && (
          <div className={styles.extension}>{extensionStringText}</div>
        )}
      </div>
      {!elementOnly && (
        <InputStatus
          appearance={appearance}
          status={status}
          statusValues={statusValues}
          error={error}
          touched={touched}
        />
      )}
    </div>
  );
};

InputWithoutFormik.displayName = 'Input';

export default InputWithoutFormik;
