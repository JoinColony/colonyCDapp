import Cleave from 'cleave.js/react';
import {
  Props as CleaveProps,
  ReactInstanceWithCleave,
} from 'cleave.js/react/props';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import Button from '~shared/Button';

import { InputProps } from './Input';

import styles from './InputComponent.css';

type CleaveChangeEvent = React.ChangeEvent<
  HTMLInputElement & { rawValue: string }
>;

const displayName = 'FormattedInputComponent';

const MSG = defineMessages({
  max: {
    id: `${displayName}.max`,
    defaultMessage: 'Max',
  },
});

interface MaxButtonProps {
  handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export const MaxButton = ({ handleClick, disabled }: MaxButtonProps) => (
  <Button
    className={styles.hookFormMaxButton}
    dataTest="inputMaxButton"
    onClick={handleClick}
    text={MSG.max}
    disabled={disabled}
  />
);

interface FormattedInputComponentProps
  extends Omit<InputProps, 'placeholder' | 'formattingOptions'>,
    Omit<CleaveProps, 'onChange' | 'name'> {
  placeholder?: string;
}

const FormattedInputComponent = ({
  options: formattingOptions,
  maxButtonParams,
  name,
  onChange,
  disabled,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  value: _,
  ...restInputProps
}: FormattedInputComponentProps) => {
  const { setValue, getValues } = useFormContext();
  const value = getValues(name);
  const [cleave, setCleave] = useState<ReactInstanceWithCleave | null>(null);

  /*
   * @NOTE Coerce cleave into handling dynamically changing options
   * See here for why this isn't yet supported "officially":
   * https://github.com/nosir/cleave.js/issues/352#issuecomment-447640572
   */

  const dynamicCleaveOptionKey = JSON.stringify(formattingOptions);

  const handleMaxButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    {
      maxAmount,
      options,
      customOnClickFn,
    }: NonNullable<FormattedInputComponentProps['maxButtonParams']>,
  ) => {
    setValue(name, maxAmount, options);
    customOnClickFn?.(e);
  };

  /**
   * A custom change handler must be provided to ensure the hook-form holds the raw value of the input
   * E.g. 123456 instead of 123,456
   */
  const handleCleaveChange = (e: CleaveChangeEvent) => {
    setValue(name, e.target.rawValue);
    onChange?.(e);
  };

  /**
   * Sync the cleave raw value with hook-form value
   * This is necessary for correctly setting the initial value
   */
  useEffect(() => {
    cleave?.setRawValue(value);
  }, [cleave, value]);

  return (
    <>
      {maxButtonParams && (
        <MaxButton
          handleClick={(e) => handleMaxButtonClick(e, maxButtonParams)}
          disabled={disabled}
        />
      )}
      <Cleave
        {...restInputProps}
        disabled={disabled}
        name={name}
        key={dynamicCleaveOptionKey}
        /*
         * @NOTE: If formattingOptions is not either memoized or defined outside of the ancestor Input component,
         * it will cause Cleave to be re-mounted and thus lose its state and focus.
         */
        options={formattingOptions}
        onInit={(cleaveInstance) => setCleave(cleaveInstance)}
        onChange={handleCleaveChange}
      />
    </>
  );
};

FormattedInputComponent.displayName = displayName;

export default FormattedInputComponent;
