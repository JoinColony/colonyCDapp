import React from 'react';
import { useFormContext } from 'react-hook-form';

import { getMainClasses } from '~utils/css';

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

export interface HookFormInputComponentProps extends Omit<InputProps, 'placeholder'> {
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
  ...restInputProps
}: HookFormInputComponentProps) => {
  const { register } = useFormContext();
  const { onChange: hookFormOnChange, onBlur: hookFormOnBlur, ref } = register(name);

  const classes = getAppearanceObject(maxLength, maxButtonParams, appearance);
  const className = getMainClasses(classes, styles);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    hookFormOnChange(e);
    onChange?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    hookFormOnBlur(e);
    onBlur?.(e);
  };

  const props = {
    ...restInputProps,
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
        <FormattedInput {...props} htmlRef={ref} maxButtonParams={maxButtonParams} options={formattingOptions} />
      ) : (
        <input {...props} className={className} ref={ref} />
      )}
      {maxLength && <LengthWidget maxLength={maxLength} length={length} />}
    </div>
  );
};

HookFormInputComponent.displayName = displayName;

export default HookFormInputComponent;
