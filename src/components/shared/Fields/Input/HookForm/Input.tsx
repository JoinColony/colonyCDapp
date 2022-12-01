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
import InputStatus from '../../InputStatus';
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
  label,
  labelValues,
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
    showConfusable && isConfusing(inputValue) && isValid && touched;

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
          aria-invalid={!!error && touched}
          id={id}
          name={name}
          placeholder={formatText(placeholder, placeholderValues)}
          {...restInputProps}
        />
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
      {showConfusableWarning && <ConfusableWarning />}
    </div>
  );
};

HookFormInput.displayName = displayName;

export default HookFormInput;
