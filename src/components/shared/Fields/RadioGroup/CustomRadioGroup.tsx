import React from 'react';
import { getMainClasses } from '~utils/css';

import { CustomRadio, CustomRadioProps } from '~shared/Fields/Radio';

import styles from './CustomRadioGroup.css';

export interface Appearance {
  direction?: 'horizontal' | 'vertical';
  gap?: 'medium';
}

interface Props {
  /** Appearance object */
  appearance?: Appearance;
  options: Omit<CustomRadioProps, 'name' | 'checked'>[];
  /** Currently selected value */
  currentlyCheckedValue: string;
  /** HTML field name */
  name: string;
  /** Disable the input */
  disabled?: boolean;
  /** Provides value for data-test used on cypress testing */
  dataTest?: string;
}

const displayName = 'CustomRadioGroup';

const CustomRadioGroup = ({
  options,
  currentlyCheckedValue,
  name,
  appearance = { direction: 'horizontal' },
  disabled,
  dataTest,
}: Props) => {
  return (
    <div className={getMainClasses(appearance, styles)}>
      {options.map(({ value, label, appearance: optionApperance, ...rest }) => (
        <CustomRadio
          checked={currentlyCheckedValue === value}
          name={name}
          value={value}
          label={label}
          key={value}
          appearance={optionApperance}
          disabled={disabled}
          dataTest={dataTest}
          {...rest}
        />
      ))}
    </div>
  );
};

CustomRadioGroup.displayName = displayName;

export default CustomRadioGroup;
