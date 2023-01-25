import React, { InputHTMLAttributes, useState } from 'react';
import classnames from 'classnames';
import { nanoid } from 'nanoid';
import { useFormContext } from 'react-hook-form';
import { isConfusing } from '@colony/unicode-confusables-noascii';
import { CleaveOptions } from 'cleave.js/options';

import { formatText } from '~utils/intl';
import ConfusableWarning from '~shared/ConfusableWarning';
import { Message } from '~types';

import InputLabel from '../../InputLabel';
import InputStatus from '../../InputStatus/HookForm';
import { InputComponentAppearance } from '../../Input';
import InputComponent from './InputComponent';
import { CoreInputProps, MaxButtonParams } from './types';

import styles from '../Input.css';

export interface HookFormInputProps
  extends CoreInputProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder' | 'name'> {
  /** Appearance object */
  appearance?: InputComponentAppearance;
  /** Add extension of input to the right of it, i.e. for ENS name */
  extensionString?: Message;
  /** Memomized options object for cleave.js formatting (see [this list](https://github.com/nosir/cleave.js/blob/master/doc/options.md)). Be sure to ensure the object is either memoized or defined outside of the component. */
  formattingOptions?: CleaveOptions;
  /** Will show a loading status beneath input if true. Takes priority over error and status. */
  isLoading?: boolean;
  /** Text displayed after the word "Loading", i.e. "Loading{annotation}...". */
  loadingAnnotation?: Message;
  /** Pass params to a max button - implemented only in Cleave options */
  maxButtonParams?: MaxButtonParams;
  /** Show ConfusableWarning based on user input */
  showConfusable?: boolean;
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
          value={inputValue}
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
