import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import Cleave from 'cleave.js/react';
import {
  Props as CleaveProps,
  ReactInstanceWithCleave,
} from 'cleave.js/react/props';
import Decimal from 'decimal.js';
import { useFormContext } from 'react-hook-form';

import Button from '~shared/Button';
import { HookFormInputProps as InputProps } from './Input';

import styles from '../InputComponent.css';

type CleaveChangeEvent = React.ChangeEvent<
  HTMLInputElement & { rawValue: string }
>;

const setCleaveRawValue = (
  cleave: ReactInstanceWithCleave,
  maxAmount: string,
  decimalPlaces = 5,
) => {
  const decimalValue = new Decimal(maxAmount);
  if (decimalValue.lt(0.00001) && decimalValue.gt(0)) {
    cleave.setRawValue(maxAmount);
  } else {
    cleave.setRawValue(
      new Decimal(maxAmount).toDP(decimalPlaces, Decimal.ROUND_DOWN).toString(),
    );
  }
};

const displayName = 'HookFormFormattedInputComponent';

const MSG = defineMessages({
  max: {
    id: `${displayName}.max`,
    defaultMessage: 'Max',
  },
});

interface MaxButtonProps {
  handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const MaxButton = ({ handleClick }: MaxButtonProps) => (
  <Button
    className={styles.hookFormMaxButton}
    dataTest="inputMaxButton"
    onClick={handleClick}
    text={MSG.max}
  />
);

interface HookFormFormattedInputComponentProps
  extends Omit<InputProps, 'placeholder' | 'formattingOptions'>,
    Omit<CleaveProps, 'onChange' | 'name'> {
  placeholder?: string;
}

const HookFormFormattedInputComponent = ({
  options: formattingOptions,
  maxButtonParams,
  name,
  value,
  onChange,
  ...restInputProps
}: HookFormFormattedInputComponentProps) => {
  const { setValue } = useFormContext();
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
    }: NonNullable<HookFormFormattedInputComponentProps['maxButtonParams']>,
  ) => {
    setValue(name, maxAmount, options);
    customOnClickFn?.(e);
    if (cleave) {
      setCleaveRawValue(cleave, maxAmount);
    }
  };

  /**
   * A custom change handler must be provided to ensure the hook-form holds the raw value of the input
   * E.g. 123456 instead of 123,456
   */
  const handleCleaveChange = (e: CleaveChangeEvent) => {
    setValue(name, e.target.rawValue);
    onChange?.(e);
  };

  return (
    <>
      {maxButtonParams && (
        <MaxButton
          handleClick={(e) => handleMaxButtonClick(e, maxButtonParams)}
        />
      )}
      <Cleave
        {...restInputProps}
        value={value}
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

HookFormFormattedInputComponent.displayName = displayName;

export default HookFormFormattedInputComponent;
