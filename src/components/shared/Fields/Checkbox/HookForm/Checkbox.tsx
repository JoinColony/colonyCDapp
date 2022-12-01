import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import { PopperOptions } from 'react-popper-tooltip';
import { useFormContext } from 'react-hook-form';

import InputLabel from '~shared/Fields/InputLabel';
import { Tooltip } from '~shared/Popover';
import { getMainClasses } from '~utils/css';

import { HookFormInputProps as InputProps } from '../../Input/HookForm';

import styles from './Checkbox.css';

interface Props extends InputProps {
  /**  Text for the checkbox tooltip */
  tooltipText?: string;
  /** Options to pass to the underlying PopperJS element. See here for more: https://popper.js.org/docs/v2/constructors/#options. */
  tooltipPopperOptions?: PopperOptions;
}

const displayName = 'HookFormCheckbox';

const HookFormCheckbox = ({
  appearance,
  children,
  className,
  disabled = false,
  elementOnly = false,
  name,
  help,
  helpValues,
  label,
  labelValues,
  onChange,
  value,
  tooltipText,
  tooltipPopperOptions,
  dataTest,
}: Props) => {
  const [inputId] = useState(nanoid());
  const { getValues, register } = useFormContext();
  const isChecked = getValues(name).indexOf(value) >= 0;
  const mainClasses = getMainClasses(appearance, styles);
  const classNames = className ? `${mainClasses} ${className}` : mainClasses;

  const showTooltip = disabled && tooltipText;
  const showLabel = !elementOnly && label;

  const { onChange: hookFormOnChange, ...helpers } = register(name);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    hookFormOnChange(e);
    onChange?.(e);
  };

  const checkboxInput = (
    <input
      {...helpers}
      id={inputId}
      className={styles.checkbox}
      type="checkbox"
      value={value}
      disabled={disabled}
      onChange={handleChange}
      aria-disabled={disabled}
      aria-checked={isChecked}
      data-test={dataTest}
    />
  );

  return (
    <div className={classNames}>
      {showTooltip ? (
        <Tooltip
          content={tooltipText}
          placement="bottom"
          popperOptions={tooltipPopperOptions}
        >
          {checkboxInput}
        </Tooltip>
      ) : (
        checkboxInput
      )}
      {showLabel ? (
        <InputLabel
          inputId={inputId}
          label={label}
          labelValues={labelValues}
          help={help}
          helpValues={helpValues}
          appearance={{ direction: 'horizontal' }}
        />
      ) : (
        children
      )}
    </div>
  );
};

HookFormCheckbox.displayName = displayName;

export default HookFormCheckbox;
