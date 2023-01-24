import React from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { getMainClasses } from '~utils/css';
import { toFinite } from '~utils/lodash';

import { HookFormInputProps as InputProps } from './Input';
import FormattedInput from './FormattedInputComponent';

import styles from '../InputComponent.css';

interface LengthWidgetProps {
  length: number;
  maxLength: number;
}

const LengthWidget = ({ length, maxLength }: LengthWidgetProps) => (
  <span className={styles.characterCounter}>
    {length}/{maxLength}
  </span>
);

export interface HookFormInputComponentProps
  extends Omit<InputProps, 'placeholder'> {
  placeholder?: string;
  inputValueLength: number;
}

const displayName = 'HookFormInputComponent';

const getAppearanceObject = (
  maxLength: HookFormInputComponentProps['maxLength'],
  maxButtonParams: HookFormInputComponentProps['maxButtonParams'],
  appearance: HookFormInputComponentProps['appearance'],
) => {
  let classes: any = {
    ...appearance,
  };

  if (maxLength) {
    classes = {
      ...classes,
      paddingRight: 'extra',
    };
  }

  if (maxButtonParams) {
    classes = {
      ...classes,
      paddingLeft: 'extra',
    };
  }
  return classes;
};

const HookFormInputComponent = ({
  appearance,
  dataTest,
  formattingOptions,
  inputValueLength: length,
  maxLength,
  maxButtonParams,
  name,
  onChange,
  onBlur,
  valueAsNumber,
  value,
  ...restInputProps
}: HookFormInputComponentProps) => {
  const { control } = useFormContext();
  const { field } = useController({
    name,
    control,
  });

  const classes = getAppearanceObject(maxLength, maxButtonParams, appearance);
  const className = getMainClasses(classes, styles);

  const transform = {
    input: (inputValue) =>
      Number.isNaN(inputValue) || inputValue === 0 ? '' : inputValue.toString(),
    output: (e) => {
      const numberWithouCommas = e.target.value.replace(/,/g, '');
      return toFinite(numberWithouCommas);
    },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(valueAsNumber ? transform.output(e) : e);
    onChange?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    field.onBlur();
    onBlur?.(e);
  };

  const props = {
    ...restInputProps,
    value: valueAsNumber ? transform.input(value) : value,
    onChange: handleChange,
    onBlur: handleBlur,
    'data-test': dataTest,
    maxLength,
    name,
    className,
    tabIndex: 0,
  };

  return (
    <div className={styles.inputContainer}>
      {formattingOptions ? (
        <FormattedInput
          {...props}
          htmlRef={field.ref}
          maxButtonParams={maxButtonParams}
          options={formattingOptions}
        />
      ) : (
        <input {...props} className={className} ref={field.ref} />
      )}
      {maxLength && <LengthWidget maxLength={maxLength} length={length} />}
    </div>
  );
};

HookFormInputComponent.displayName = displayName;

export default HookFormInputComponent;
