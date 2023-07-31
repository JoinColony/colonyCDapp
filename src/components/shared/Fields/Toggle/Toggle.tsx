import React from 'react';
import { useFormContext } from 'react-hook-form';

import InputLabel from '~shared/Fields/InputLabel';
import QuestionMarkTooltip from '~shared/QuestionMarkTooltip';

import { getMainClasses } from '~utils/css';

import styles from './Toggle.css';
import { CheckboxProps } from '~shared/Fields/Checkbox';

const displayName = 'Toggle';

interface Appearance {
  theme?: 'primary' | 'danger';
}

interface Props extends Omit<CheckboxProps, 'appearance'> {
  appearance?: Appearance;
  tooltipClassName?: string;
}

const Toggle = ({
  appearance,
  name,
  label,
  labelValues,
  disabled = false,
  elementOnly = false,
  onChange,
  tooltipTextValues,
  tooltipText,
  tooltipClassName,
  tooltipPopperOptions = {
    placement: 'right-start',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [-3, 10],
        },
      },
    ],
  },
  ...toggleProps
}: Props) => {
  const { register, watch } = useFormContext();
  const { onChange: hookFormOnChange, ...hookFormHelpers } = register(name);

  const value = watch(name);

  const mainClasses = getMainClasses(appearance, styles);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    hookFormOnChange(e);
    onChange?.(e);
  };
  return (
    <div className={styles.container}>
      {!elementOnly && label && (
        <InputLabel
          label={label}
          labelValues={labelValues}
          appearance={{ colorSchema: 'grey' }}
        />
      )}
      <div className={styles.checkboxContainer}>
        <input
          {...hookFormHelpers}
          type="checkbox"
          disabled={disabled}
          aria-checked={value}
          aria-disabled={disabled}
          className={styles.delegate}
          onChange={handleChange}
          {...toggleProps}
        />
        <span className={disabled ? styles.toggleDisabled : styles.toggle}>
          <span className={value ? mainClasses : styles.toggleSwitch} />
        </span>
      </div>
      {tooltipText && (
        <QuestionMarkTooltip
          className={styles.icon}
          tooltipText={tooltipText}
          tooltipPopperOptions={tooltipPopperOptions}
          tooltipClassName={tooltipClassName}
          tooltipTextValues={tooltipTextValues}
        />
      )}
    </div>
  );
};

Toggle.displayName = displayName;

export default Toggle;
