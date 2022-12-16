import React, { InputHTMLAttributes, ReactNode, useState } from 'react';
import classnames from 'classnames';
import { CleaveOptions } from 'cleave.js/options';
import { MessageDescriptor } from 'react-intl';
import { nanoid } from 'nanoid';
import { SetValueConfig, useFormContext } from 'react-hook-form';
import { isConfusing } from '@colony/unicode-confusables-noascii';

import { Message, SimpleMessageValues } from '~types';
import { formatText } from '~utils/intl';
import ConfusableWarning from '~shared/ConfusableWarning';

import InputLabel from '../../InputLabel';
import InputStatus from '../../InputStatus/HookForm';
import { InputComponentAppearance } from '../../Input';

import InputComponent from './InputComponent';
import styles from '../Input.css';

interface MaxButtonParams {
  maxAmount: string;
  options?: SetValueConfig;
  customOnClickFn?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface HookFormInputProps
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

  /** Memomized options object for cleave.js formatting (see [this list](https://github.com/nosir/cleave.js/blob/master/doc/options.md)). Be sure to ensure the object is either memoized or defined outside of the component. */
  formattingOptions?: CleaveOptions;

  /** Help text */
  help?: Message;

  /** Help text values for intl interpolation */
  helpValues?: SimpleMessageValues;

  /** Html `id` for label & input */
  id?: string;

  /** Will show a loading status beneath input if true. Takes priority over error and status. */
  isLoading?: boolean;

  /** Label text */
  label?: Message;

  /** Label text values for intl interpolation */
  labelValues?: SimpleMessageValues;

  /** Text displayed after the word "Loading", i.e. "Loading{annotation}...". */
  loadingAnnotation?: Message;

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

  /** Show ConfusableWarning based on user input */
  showConfusable?: boolean;

  /** Status text */
  status?: Message;

  /** Status text values for intl interpolation */
  statusValues?: SimpleMessageValues;
}

const displayName = 'HookFormInput';

const HookFormInput = ({
  appearance = {},
  elementOnly,
  extensionString,
  extra,
  help,
  helpValues,
  id: idProp,
  isLoading,
  label,
  labelValues,
  loadingAnnotation,
  name,
  placeholder,
  placeholderValues,
  showConfusable = false,
  status,
  statusValues,
  ...restInputProps
}: HookFormInputProps) => {
  const [id] = useState(idProp || nanoid());
  const {
    formState: { errors, touchedFields, isValid },
    watch,
  } = useFormContext();

  const inputValue = watch(name);
  const error = errors[name]?.message as string | undefined;
  const touched = touchedFields[name] as boolean | undefined;

  const extensionStringText = formatText(extensionString);

  const containerClasses = classnames(styles.container, {
    [styles.containerHorizontal]: appearance.direction === 'horizontal',
  });

  const showConfusableWarning =
    showConfusable && isConfusing(inputValue || '') && isValid && touched;

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
        <InputComponent
          appearance={appearance}
          aria-invalid={!!error && !isLoading && touched}
          id={id}
          name={name}
          placeholder={formatText(placeholder, placeholderValues)}
          inputValueLength={inputValue?.length || 0}
          {...restInputProps}
        />
        {extensionStringText && (
          <div className={styles.extension}>{extensionStringText}</div>
        )}
      </div>
      {!elementOnly && (
        <InputStatus
          appearance={appearance}
          error={error}
          isLoading={isLoading}
          loadingAnnotation={loadingAnnotation}
          status={status}
          statusValues={statusValues}
          touched={touched}
        />
      )}
      {showConfusableWarning && <ConfusableWarning />}
    </div>
  );
};

HookFormInput.displayName = displayName;

export default HookFormInput;
